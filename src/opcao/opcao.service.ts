import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OpcaoService {
  constructor(private readonly prismaService: PrismaService) {}
  findOne(id: number) {
    try {
      const option = this.prismaService.$queryRaw`
      SELECT * FROM Opcao WHERE id = ${id};
      `;
      return option;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar opção');
    }
  }
}
