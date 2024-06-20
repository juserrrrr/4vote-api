import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    return await this.prisma.$executeRaw`INSERT INTO Tag (nome) VALUES (${createTagDto.nome})`;
  }

  async findAll() {
    return await this.prisma.$queryRaw`SELECT * FROM Tag`;
  }

  async findOne(nome: string) {
    return await this.prisma.$queryRaw`SELECT * FROM Tag WHERE nome = ${nome}`;
  }
}
