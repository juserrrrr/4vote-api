import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Prisma } from '@prisma/client';
import { UploadService } from '../modules/upload/upload.service';
import { FileDTO } from '../modules/upload/upload.dto';

export interface IFindMe {
  nome: string;
  email: string;
  cpf: string;
}

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  // Acha o usuario atual com base no token que está nos headers
  async findMe(userId: number) {
    try {
      const user = await this.prisma.$queryRaw<IFindMe[]>`
      SELECT nome, email, cpf, URLimagem
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

  async update(userId: number, updateUsuarioDto: UpdateUsuarioDto, file: FileDTO) {
    let newDto;
    if (file) {
      const responseUpload = await this.uploadService.upload(file);
      newDto = { ...updateUsuarioDto, URLimagem: responseUpload.url };
    }

    const setValuesSql = Object.entries(newDto ? newDto : updateUsuarioDto).map(([key, value]) => {
      return Prisma.sql`${Prisma.raw(key)}=${value}`;
    });
    const sqlQuery = Prisma.sql`UPDATE Usuario SET ${Prisma.join(setValuesSql, `, `)} WHERE id=${userId}`;
    try {
      const updatedUsuario = await this.prisma.$executeRaw<1 | 0>(sqlQuery);
      if (updatedUsuario === 0) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      return newDto;
    } catch (e) {
      throw new ConflictException('Email já existe');
    }
  }
}
