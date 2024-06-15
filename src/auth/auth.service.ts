import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usuarioService: UsuariosService,
  ) {}

  async login(emailUsuario: string, senhaUsuario: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: emailUsuario } });
    if (!usuario || !compare(senhaUsuario, usuario.senha)) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return {
      access_token: this.jwtService.sign(
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
