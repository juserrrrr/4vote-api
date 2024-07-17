import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Prisma } from '@prisma/client';

export interface IFindMe {
  nome: string;
  email: string;
  cpf: string;
}

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
  async findMe(userId: number) {
    try {
      const user = await this.prisma.$queryRaw<IFindMe[]>`
      SELECT nome, email, cpf
      FROM Usuario
      WHERE id=${userId}
    `;
      if (user.length === 0) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      return user[0];
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else throw new InternalServerErrorException('Erro interno ao criar uma pesquisa');
    }
  }

  async update(userId: number, updateUsuarioDto: UpdateUsuarioDto) {
    const setValuesSql = Object.entries(updateUsuarioDto).map(([key, value]) => {
      return Prisma.sql`${Prisma.raw(key)}=${value}`;
    });
    const sqlQuery = Prisma.sql`UPDATE Usuario SET ${Prisma.join(setValuesSql, `, `)} WHERE id=${userId}`;
    try {
      const updatedUsuario = await this.prisma.$executeRaw<1 | 0>(sqlQuery);
      if (updatedUsuario === 0) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      return updateUsuarioDto;
    } catch (e) {
      throw new ConflictException('Email já existe');
    }
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
