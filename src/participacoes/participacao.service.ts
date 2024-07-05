import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { CreateOpcaoVotadaDto } from '../opcaoVotada/dto/create-opcaovotada.dto';

@Injectable()
export class ParticipacaoService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOptionsVoted(
    optionsVoted: CreateOpcaoVotadaDto[],
    idVote: number,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    // Transforma os dados das opções votadas em uma lista de dicionários do tipo {idVote, idOpcao} usando map
    const optionsVotedMap = optionsVoted.map((optionVoted) => ({
      voto_id: idVote,
      opcao_id: optionVoted.id_opcao,
    }));

    // Cria no banco todas as opcoes_votadas
    await prisma.opcao_Votada.createMany({
      data: optionsVotedMap,
    });
  }

  async generateHash(opcoesVotadas: CreateOpcaoVotadaDto[]): Promise<string> {
    console.log(opcoesVotadas);
    return 'hash1234567';
  }

  // Método para criação do voto
  async createVote(
    hash: string,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
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
  ) {
    // Executa a query SQL para inserir a participação
    await prisma.participacao.create({
      data: {
        pesquisa_id: idSurvey,
        usuario_id: idUser,
      },
    });
  }

  // Criação da participação em uma pesquisa e retorno da hash do voto
  async create(createParticipacaoDto: CreateParticipacaoDto, idUser: number, idSurvey: number): Promise<string> {
    try {
      const { voto } = createParticipacaoDto;
      const optionsVoted = voto.opcoesVotadas;
      // Geracao da hash
      const hash = await this.generateHash(voto.opcoesVotadas);

      return await this.prismaService.$transaction(async (prisma) => {
        // Criacao da participação
        await this.createParticipation(idUser, idSurvey, prisma);

        // Criação do voto passando a hash
        const idVote = await this.createVote(hash, prisma);

        // Criação das Opções Votadas
        await this.createOptionsVoted(optionsVoted, idVote, prisma);
        return hash;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else throw new InternalServerErrorException('Erro interno ao criar uma pesquisa');
    }
  }

  async getById(id: number) {
    return await this.prismaService.participacao.findUnique({
      where: {
        id: id,
      },
    });
  }
}
