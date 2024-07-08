import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}
  findAll() {
    try {
      const tags = this.prismaService.$queryRaw`SELECT * FROM Tag;`;
      return tags;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar tags');
    }
  }

  findOne(id: number) {
    try {
      const tag = this.prismaService.$queryRaw`
      SELECT * FROM Tag WHERE id = ${id};
      `;
      return tag;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar tag');
    }
  }
}
