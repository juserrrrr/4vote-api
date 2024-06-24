import { Injectable } from '@nestjs/common';
import { CreatePerguntaDto } from './dto/create-pergunta.dto';
import { UpdatePerguntaDto } from './dto/update-pergunta.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PerguntasService {
  constructor(private readonly prisma: PrismaService) {}

  create(_createPerguntaDto: CreatePerguntaDto) {
    return this.prisma.pergunta.create({ data: _createPerguntaDto });
  }

  findAll() {
    return this.prisma.pergunta.findMany();
  }

  findOne(id: number) {
    return this.prisma.pergunta.findUnique({ where: { id } });
  }

  update(id: number, updatePerguntaDto: UpdatePerguntaDto) {
    return this.prisma.pergunta.update({ where: { id }, data: updatePerguntaDto });
  }

  remove(id: number) {
    return this.prisma.pergunta.delete({ where: { id } });
  }
}
