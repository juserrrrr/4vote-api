import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      return await this.prisma.usuario.create({
        data: createUsuarioDto,
      });
    } catch (e) {} // Desenvolver um melhor tratamento de erros
  }

  async findAll() {
    return this.prisma.usuario.findMany();
  }

  async findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return this.prisma.usuario.update({
      where: { id },
      data: updateUsuarioDto,
    });
  }

  async remove(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}
