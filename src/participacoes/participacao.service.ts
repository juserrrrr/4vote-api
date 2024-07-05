import { Injectable } from '@nestjs/common';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class ParticipacaoService {
  constructor(private readonly prismaService: PrismaService) {}

  // Criação da Participição e retorno do id
  async createParticipation(
    idUser: number,
    idSurvey: number,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ): Promise<number> {
    // Executa a query SQL para inserir a participação
    await prisma.$executeRaw`
      INSERT INTO Participacao (pesquisa_id, usuario_id)
      VALUES (${idSurvey}, ${idUser})
    `;

    // Busca o ID da participacao criada
    const result = await prisma.$queryRaw`
      SELECT LAST_INSERT_ID() as id;
    `;
    // Retorna o ID da participacao criada
    const idParticipation = Number(result[0].id);
    return idParticipation ? idParticipation : null;
  }

  async create(createParticipacaoDto: CreateParticipacaoDto, idUser: number, idSurvey: number): Promise<string> {
    return await this.prismaService.$transaction(async (prisma) => {
      //const { voto, opcoesVotadas } = createParticipacaoDto;

      const idParticipacao = await this.createParticipation(idUser, idSurvey, prisma);
      return `Participação criada com sucesso de id: ${idParticipacao}`;
    });
  }

  getById(id: number): string {
    return `Retornando participação com o id ${id.toString()}`;
  }
}
