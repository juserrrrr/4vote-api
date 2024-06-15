import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { compare } from 'bcrypt';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usuarioService: UsuariosService,
  ) {}

  async login(loginDto: AuthLoginDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: loginDto.email } });
    if (!usuario || !compare(loginDto.senha, usuario.senha)) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return {
      accessToken: this.jwtService.sign(
        {
          sub: usuario.id,
          nome: usuario.nome,
        },
        {
          expiresIn: '1d',
          subject: String(usuario.id),
          issuer: '4voteSignature',
        },
      ),
    };
  }
}
