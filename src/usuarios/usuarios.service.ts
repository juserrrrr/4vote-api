import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      return await this.prisma.usuario.create({
        data: createUsuarioDto,
      });
    } catch (e) {
      console.log(e);
    } // Desenvolver um melhor tratamento de erros
  }

  // Acha o usuario atual com base no token que está nos headers
  async findMe(header: Headers) {
    const token = header['authorization'].split(' ')[1];
    const decodedJwt = jwtDecode(token);
    const id = decodedJwt['id'];
    let usuario = null;

    try {
      usuario = await this.prisma.$queryRaw`
      SELECT nome, email, cpf
      FROM Usuario
      WHERE id=${id}
    `;
    } catch (e) {
      console.log(e);
    }

    return usuario;
  }

  async update(header: Headers, updateUsuarioDto: UpdateUsuarioDto) {
    const token = header['authorization'].split(' ')[1];
    const decodedJwt = jwtDecode(token);
    const id = decodedJwt['id'];
    let updateUsuario = null;

    try {
      updateUsuario = await this.prisma.$executeRaw`
    UPDATE Usuario
    SET nome=${updateUsuarioDto.nome}, email=${updateUsuarioDto.email}
    WHERE id=${id}
    `;
    } catch (e) {
      throw new ConflictException('Email já existe');
    }

    return updateUsuario;
  }

  async findByEmail(email: string) {
    let usuario = null;

    try {
      usuario = await this.prisma.$queryRaw`
      SELECT id, nome, email, senha
      FROM Usuario
      WHERE email=${email}
    `;
    } catch (e) {
      console.log(e);
    }

    return usuario;
  }
}
