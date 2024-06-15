import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { compare, genSalt, hash } from 'bcrypt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthCadastroDto } from './dto/auth-cadastro.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usuarioService: UsuariosService,
  ) {}

  criarToken({ id, nome }: { id: Number; nome: string }) {
    const accessToken = this.jwtService.sign(
      {
        id,
        nome,
      },
      {
        expiresIn: '1d',
        subject: String(id),
        issuer: '4voteSignature',
      },
    );

    return { accessToken };
  }

  async login(loginDto: AuthLoginDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: loginDto.email } });
    if (!usuario || !compare(loginDto.senha, usuario.senha)) {
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
