import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { AuthCadastroDto } from './dto/auth-cadastro.dto';
import { AuthEntrarDto } from './dto/auth-entrar.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AuthService {
  private readonly frontendBaseUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {
    this.frontendBaseUrl = process.env.FRONTEND_BASE_URL;
  }

  private async generateUniqueCode(): Promise<string> {
    let isUnique = false;
    let uniqueCode = '';
    while (!isUnique) {
      uniqueCode = Math.random().toString(36).substring(2, 8); // Gera um código aleatório
      const existing = await this.prisma.codigoValidacao.findUnique({
        where: { codigo: uniqueCode },
      });
      if (!existing) {
        isUnique = true;
      }
    }
    return uniqueCode;
  }

  createToken({ id, nome }: { id: number; nome: string }) {
    const accessToken = this.jwtService.sign(
      {
        nome,
      },
      {
        expiresIn: '1d',
        subject: String(id),
        issuer: 'Assinatura4Vote',
      },
    );

    return { accessToken };
  }

  async login(entrarDto: AuthEntrarDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: entrarDto.email },
    });
    if (!usuario || !(await compare(entrarDto.senha, usuario.senha))) {
      throw new BadRequestException('Credenciais inválidas');
    }

    // Verificar se o usuário está validado
    if (!usuario.validado) {
      throw new UnauthorizedException('Conta não validada. Por favor, valide sua conta.');
    }

    const payload = { id: usuario.id, nome: usuario.nome };
    return this.createToken(payload);
  }

  async register(cadastroDto: AuthCadastroDto) {
    const salt = await genSalt();
    cadastroDto.senha = await hash(cadastroDto.senha, salt);
    const usuario = await this.prisma.usuario.create({
      data: { ...cadastroDto, validado: false },
    });
    if (!usuario) {
      throw new UnauthorizedException('Erro ao cadastrar usuário');
    }

    // Gera um código de validação
    const codigoValidacao = await this.generateUniqueCode();
    await this.prisma.codigoValidacao.create({
      data: {
        usuarioId: usuario.id,
        codigo: codigoValidacao,
      },
    });

    // Gerar o link de validação para o front-end usando a variável de ambiente
    const linkValidacao = `${this.frontendBaseUrl}/autenticar/${codigoValidacao}`;

    // Envia o e-mail com o link de validação
    const template = this.mailerService.loadTemplate('codigo-validacao');
    const replacements = {
      nome: usuario.nome,
      linkValidacao,
    };

    const emailHtml = this.mailerService.template(template, replacements);

    await this.mailerService.sendEmail({
      recipients: [{ name: usuario.nome, address: usuario.email }],
      subject: 'Validação de Conta',
      html: emailHtml,
    });
    return { message: 'Usuário cadastrado com sucesso, verifique seu email' };
  }

  // Função de recuperação de senha
  async recoverPassword(email: string) {
    // Procura pelo usuário no banco de dados com base no email fornecido
    const user = await this.prisma.usuario.findUnique({
      where: { email: email },
    });

    // Se o usuário não for encontrado, lança uma exceção NotFoundException
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Gera uma nova senha aleatória de 8 caracteres
    const novaSenha = Math.random().toString(36).slice(-8);

    // Gera um salt e faz o hash da nova senha
    const salt = await genSalt();
    const hashedSenha = await hash(novaSenha, salt);

    // Atualiza a senha do usuário no banco de dados com a nova senha hasheada
    await this.prisma.usuario.update({
      where: { email },
      data: { senha: hashedSenha },
    });

    // Carrega o template de email de recuperação de senha
    const template = this.mailerService.loadTemplate('password-reset');
    const replacements = {
      nome: user.nome, // Nome do usuário para personalizar o email
      novaSenha, // Nova senha para informar ao usuário
    };

    // Envia o email de recuperação de senha usando o serviço de email
    await this.mailerService.sendEmail({
      recipients: [{ name: user.nome, address: email }],
      subject: 'Recuperação de Senha', // Assunto do email
      html: this.mailerService.template(template, replacements), // Conteúdo do email com placeholders substituídos
    });

    // Retorna uma mensagem de sucesso
    return { message: 'Nova senha enviada para o email' };
  }

  async resendValidationEmail(email: string) {
    // Procura pelo usuário no banco de dados com base no email fornecido
    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });

    // Se o usuário não for encontrado, lança uma exceção NotFoundException
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Procura pelo código de validação no banco de dados com base no ID do usuário
    const codigoValidacao = await this.prisma.codigoValidacao.findFirst({
      where: { usuarioId: user.id },
    });

    // Se o código de validação não for encontrado, lança uma exceção NotFoundException
    if (!codigoValidacao) {
      throw new NotFoundException('Código de validação não encontrado');
    }

    // Gera um link de validação para o front-end usando a variável de ambiente
    const linkValidacao = `${this.frontendBaseUrl}/autenticar/${codigoValidacao.codigo}`;

    // Carrega o template de email de validação de conta
    const template = this.mailerService.loadTemplate('codigo-validacao');
    const replacements = {
      nome: user.nome, // Nome do usuário para personalizar o email
      linkValidacao, // Link de validação para o front-end
    };

    // Envia o email de validação de conta usando o serviço de email
    this.mailerService.sendEmail({
      recipients: [{ name: user.nome, address: email }],
      subject: 'Validação de Conta', // Assunto do email
      html: this.mailerService.template(template, replacements), // Conteúdo do email com placeholders substituídos
    });

    // Retorna uma mensagem de sucesso
    return { message: 'Email de validação reenviado' };
  }

  // Função de validação de conta
  async validadeUser(codigo: string) {
    const validacao = await this.prisma.codigoValidacao.findFirst({
      where: { codigo },
    });

    if (!validacao) {
      throw new BadRequestException('Código de validação inválido');
    }

    try {
      await this.prisma.$transaction(async (prismaTransaction) => {
        await prismaTransaction.usuario.update({
          where: { id: validacao.usuarioId },
          data: { validado: true },
        });

        await prismaTransaction.codigoValidacao.delete({
          where: { id: validacao.id },
        });
      });
      return { message: 'Conta validada com sucesso' };
    } catch (error) {
      throw new BadRequestException('Erro ao validar a conta, tente novamente.');
    }
  }
}
