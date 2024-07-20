import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OpcaoVotadaService {
  constructor(private readonly prisma: PrismaService) {}

  async findByVote(idVote: number) {
    return await this.prisma.opcao_Votada.findMany({
      where: {
        voto_id: idVote,
      },
    });
  }
}
