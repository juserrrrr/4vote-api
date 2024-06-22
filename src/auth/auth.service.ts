import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { AuthCadastroDto } from './dto/auth-cadastro.dto';
import { AuthEntrarDto } from './dto/auth-entrar.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usuarioService: UsuariosService,
  ) {}

  criarToken({ id, nome }: { id: number; nome: string }) {
    const accessToken = this.jwtService.sign(
      {
        id,
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
    if (!usuario || !compare(entrarDto.senha, usuario.senha)) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const payload = { id: usuario.id, nome: usuario.nome };
    return this.criarToken(payload);
  }

  async cadastro(cadastroDto: AuthCadastroDto) {
    const salt = await genSalt();
    cadastroDto.senha = await hash(cadastroDto.senha, salt);
    const usuario = await this.usuarioService.create(cadastroDto);
    if (!usuario) {
      throw new UnauthorizedException('Erro ao cadastrar usuário');
    }
    const payload = { id: usuario.id, nome: usuario.nome };
    return this.criarToken(payload);
  }
}
