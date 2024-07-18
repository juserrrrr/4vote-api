import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PerguntasService {
  constructor(private readonly prismaService: PrismaService) {}

  findOne(id: number) {
    try {
      const question = this.prismaService.$queryRaw`
      SELECT * FROM Pergunta WHERE id = ${id};
      `;
      return question;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar pergunta');
    }
  }
}
