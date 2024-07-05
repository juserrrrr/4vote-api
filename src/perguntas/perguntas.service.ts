import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PerguntasService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: number) {
    return this.prisma.pergunta.findUnique({ where: { id } });
  }
}
