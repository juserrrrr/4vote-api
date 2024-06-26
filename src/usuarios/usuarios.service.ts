import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

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

  async findMe(id: number) {
    const usuario = await this.prisma.$queryRaw`
    SELECT nome, email, cpf
    FROM Usuario
    WHERE id=${id}
    `;

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const updateUsuario = await this.prisma.$executeRaw`
    UPDATE Usuario
    SET nome=${updateUsuarioDto.nome}, email=${updateUsuarioDto.email}
    WHERE id=${id}
    `;
    return updateUsuario;
  }
}
