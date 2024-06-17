import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    return await this.prisma
      .$executeRaw`INSERT INTO Usuario (nome, email, cpf, senha, URLimagem) VALUES (${createUsuarioDto.nome}, ${createUsuarioDto.email}, ${createUsuarioDto.cpf}, ${createUsuarioDto.senha}, ${createUsuarioDto.URLimagem})`;
  }

  async getAll() {
    return await this.prisma.$queryRaw`SELECT * FROM Usuario`;
  }

  async getOne(id: number) {
    return await this.prisma.$queryRaw`SELECT * FROM Usuario WHERE id = ${id}`;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return await this.prisma
      .$executeRaw`UPDATE Usuario SET nome = ${updateUsuarioDto.nome}, email = ${updateUsuarioDto.email}, cpf = ${updateUsuarioDto.cpf}, senha = ${updateUsuarioDto.senha}, URLimagem = ${updateUsuarioDto.URLimagem} WHERE id = ${id}`;
  }

  async remove(id: number) {
    return await this.prisma.$executeRaw`DELETE FROM Usuario WHERE id = ${id}`;
  }
}
