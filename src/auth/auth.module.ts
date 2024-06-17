import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [PrismaModule, JwtModule.register({ secret: process.env.JWT_SECRET }), UsuariosModule],
})
export class AuthModule {}
