import { Injectable } from '@nestjs/common';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { CreateVotoDto } from '../voto/dto/create-voto.dto';
import { CreateOpcaoVotadaDto } from '../opcaoVotada/dto/create-opcaovotada.dto';

@Injectable()
export class ParticipacaoService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOptionsVoted(
    voto: CreateVotoDto,
    idVote: number,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    // Transforma os dados das opções votadas em uma lista de dicionários do tipo {idVote, idOpcao} usando map
    const optionsVoted = voto.opcoesVotadas.map((optionVoted) => ({
      voto_id: idVote,
      opcao_id: optionVoted.id_opcao,
    }));

    console.log(optionsVoted);
    // Cria no banco todas as opcoes_votadas
    await prisma.opcao_Votada.createMany({
      data: optionsVoted,
    });
  }

  async generateHash(opcoesVotadas: CreateOpcaoVotadaDto[]): Promise<string> {
    console.log(opcoesVotadas);
    return 'hash1234567';
  }

  // Método para criação do voto
  async createVote(
    voto: CreateVotoDto,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    // Geracao da hash
    const hash = await this.generateHash(voto.opcoesVotadas);

    // Criacao do voto passando sua hash
    const vote = await prisma.voto.create({
      data: {
        hash: hash,
      },
    });

    // Retorna o id do voto criado
    return vote.id;
  }

  // Método para a criação da Participição e retorno do id
  async createParticipation(
    idUser: number,
    idSurvey: number,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ): Promise<number> {
    // Executa a query SQL para inserir a participação
    const participation = await prisma.participacao.create({
      data: {
        pesquisa_id: idSurvey,
        usuario_id: idUser,
      },
    });

    // Retorna o ID da participacao criada
    return participation.id;
  }

  async create(createParticipacaoDto: CreateParticipacaoDto, idUser: number, idSurvey: number): Promise<string> {
    const { voto } = createParticipacaoDto;
    // Geracao da hash
    const hash = await this.generateHash(voto.opcoesVotadas);

    return await this.prismaService.$transaction(async (prisma) => {
      const idParticipation = await this.createParticipation(idUser, idSurvey, prisma);
      const idVote = await this.createVote(voto, prisma);
      await this.createOptionsVoted(voto, idVote, prisma);
      return `Participação criada com sucesso de id: ${idParticipation}`;
    });
  }

  getById(id: number): string {
    return `Retornando participação com o id ${id.toString()}`;
  }
}
