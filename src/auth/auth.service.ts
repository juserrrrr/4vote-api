import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { AuthCadastroDto } from './dto/auth-cadastro.dto';
import { AuthEntrarDto } from './dto/auth-entrar.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AuthService {
  private readonly frontendBaseUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usuariosService: UsuariosService,
    private readonly mailerService: MailerService,
  ) {
    this.frontendBaseUrl = process.env.FRONTEND_BASE_URL;
  }

  criarToken({ id, nome }: { id: number; nome: string }) {
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

  async entrar(entrarDto: AuthEntrarDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: entrarDto.email },
    });
    if (!usuario || !(await compare(entrarDto.senha, usuario.senha))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { id: usuario.id, nome: usuario.nome };
    return this.criarToken(payload);
  }

  async cadastro(cadastroDto: AuthCadastroDto) {
    const salt = await genSalt();
    cadastroDto.senha = await hash(cadastroDto.senha, salt);
    const usuario = await this.usuariosService.create({
      ...cadastroDto,
      validado: false, // Definido como não validado inicialmente
    });
    if (!usuario) {
      throw new UnauthorizedException('Erro ao cadastrar usuário');
    }

    // Gera um código de validação
    const codigoValidacao = Math.random().toString(36).substr(2, 8);
    await this.prisma.codigoValidacao.create({
      data: {
        usuarioId: usuario.id,
        codigo: codigoValidacao,
      },
    });

    const payload = { id: usuario.id, nome: usuario.nome };

    // Gerar o link de validação para o front-end usando a variável de ambiente
    const linkValidacao = `${this.frontendBaseUrl}/validar-usuario?usuarioId=${usuario.id}&codigo=${codigoValidacao}`;

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

    return this.criarToken(payload);
  }

  // Função de recuperação de senha
  async recuperarSenha(email: string) {
    // Procura pelo usuário no banco de dados com base no email fornecido
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    // Se o usuário não for encontrado, lança uma exceção NotFoundException
    if (!usuario) {
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
      nome: usuario.nome, // Nome do usuário para personalizar o email
      novaSenha, // Nova senha para informar ao usuário
    };

    // Envia o email de recuperação de senha usando o serviço de email
    await this.mailerService.sendEmail({
      recipients: [{ name: usuario.nome, address: email }],
      subject: 'Recuperação de Senha', // Assunto do email
      html: this.mailerService.template(template, replacements), // Conteúdo do email com placeholders substituídos
    });

    // Retorna uma mensagem de sucesso
    return { message: 'Nova senha enviada para o email' };
  }

  // Função de validação de conta
  async validarUsuario(usuarioId: number, codigo: string) {
    const validacao = await this.prisma.codigoValidacao.findFirst({
      where: { usuarioId, codigo },
    });

    if (!validacao) {
      throw new UnauthorizedException('Código de validação inválido');
    }

    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { validado: true },
    });

    await this.prisma.codigoValidacao.delete({
      where: { id: validacao.id },
    });

    return { message: 'Conta validada com sucesso' };
  }
}
