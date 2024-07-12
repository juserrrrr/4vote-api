import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { CreateOpcaoVotadaDto } from '../opcaoVotada/dto/create-opcaovotada.dto';
import * as crypto from 'crypto';

@Injectable()
export class ParticipacaoService {
  constructor(private readonly prismaService: PrismaService) {}

  // Checa se o usuário já votou naquela pesquisa
  async checkUser(
    idUser: number,
    idSurvey: number,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const query = await prisma.participacao.findUnique({
      where: {
        participation: {
          usuario_id: idUser,
          pesquisa_id: idSurvey,
        },
      },
    });
    if (query) {
      throw new HttpException(
        `Usuário de ID ${idUser} já participou da pesquisa de id ${idSurvey}`,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // Checa se o usuário votou na mesma opção mais de uma vez
  async checkDuplicatedOptions(optionsVoted: CreateOpcaoVotadaDto[]) {
    // Pega os ids das opções votadas
    const optionsVotedIDs = optionsVoted.map((option: CreateOpcaoVotadaDto) => option.idOption);

    // Pega o index da primeira ocorrência de um item (número). Se houver outra ocorrência, os index não batem
    const repeatedOptions = optionsVotedIDs.filter((item, index) => optionsVotedIDs.indexOf(item) != index); // Conjunto para as opções repetidas

    if (repeatedOptions.length != 0) {
      throw new HttpException(`Opções com ID: ${repeatedOptions} foram votadas mais de uma vez`, HttpStatus.FORBIDDEN);
    }
  }

  // Checa se as opções votadas estão no Banco
  async checkOptions(
    optionsVoted: CreateOpcaoVotadaDto[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    // Pega os ids das opções votadas
    const optionsVotedIDs = optionsVoted.map((option: CreateOpcaoVotadaDto) => option.idOption);

    // Verifica quais ids da lista de opções votadas está no Banco (Lista de opções válidas abaixo)
    const validOptions = await prisma.opcao.findMany({
      where: {
        id: { in: optionsVotedIDs },
      },
    });

    // Verificar se todas as opções votadas são válidas
    const validOptionIDs = validOptions.map((option) => option.id);
    const invalidOptions = optionsVotedIDs.filter((optionId) => !validOptionIDs.includes(optionId));

    // Se houver opções inválidas (não há estas opções no Banco, será lançada uma exceção)
    if (invalidOptions.length > 0) {
      throw new HttpException(`Opções inválidas: ${invalidOptions.join(', ')}`, HttpStatus.NOT_FOUND);
    }
  }

  // Checar se as opções pertencem a pesquisa
  async checkSurvey(
    idSurvey: number,
    optionsVoted: CreateOpcaoVotadaDto[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    // Pegas os ids das opções daquela pesquisa
    const optionsSurvey: { id: number }[] = await prisma.$queryRaw`
      SELECT O.id
      FROM Opcao O
      JOIN Pergunta P ON O.pergunta_id = P.id
      JOIN Pesquisa PQ ON P.pesquisa_id = PQ.id
      WHERE PQ.id = ${idSurvey}; 
    `;

    // Coletando os ids da pesquisa consultada e os ids das opções votadas
    const optionsSurveyIDs = optionsSurvey.map((option) => option.id);
    const optionsVotedIDs = optionsVoted.map((option: CreateOpcaoVotadaDto) => option.idOption);

    // True se todas as opções votadas estão na pesquisa, False caso contrário
    const allOptionsInSurvey = optionsVotedIDs.every((item) => optionsSurveyIDs.includes(item));

    // Encontrar as opções votadas que não pertencem à pesquisa
    const optionsNaoDaPesquisa = optionsVotedIDs.filter((id) => !optionsSurveyIDs.includes(id));

    if (!allOptionsInSurvey) {
      throw new HttpException(
        `As opções ${optionsNaoDaPesquisa} não estão na pesquisa de id ${idSurvey}`,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // Checar se todas perguntas teve pelo menos uma opção votada
  async checkOptionsPerQuestion(
    idSurvey: number,
    optionsVoted: CreateOpcaoVotadaDto[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const OptionsFromQuestions: { optionId: number; questionId: number }[] = await prisma.$queryRaw`
      SELECT O.id optionId, P.id questionId
      FROM Opcao O
      JOIN Pergunta P ON O.pergunta_id = P.id
      JOIN Pesquisa PQ ON P.pesquisa_id = PQ.id
      WHERE PQ.id = ${idSurvey};
    `;

    //// Coletando os ids das opções votadas
    const optionsVotedIDs = optionsVoted.map((option: CreateOpcaoVotadaDto) => option.idOption);

    // Formato do grupo: {pesquisa: id, options[]}
    const group: { [key: number]: number[] } = {};

    // Geração de uma lista de objetos para agrupar as opções de cada pergunta da pesquisa
    OptionsFromQuestions.forEach((option) => {
      const { questionId, optionId } = option;
      if (!group[questionId]) {
        group[questionId] = [];
      }
      group[questionId].push(optionId);
    });

    // Convertendo o agrupamento para o formato desejado {pesquisa: id, options[]}
    const questions = Object.keys(group).map((questionId) => ({
      question: questionId,
      options: group[questionId],
    }));

    // Filtrar perguntas sem opções votadas
    const questionsWithoutOptionsVoted = questions.filter(
      (question) => !question.options.some((option) => optionsVotedIDs.includes(option)),
    );

    if (questionsWithoutOptionsVoted.length > 0) {
      throw new HttpException(
        `As perguntas de id ${questionsWithoutOptionsVoted.map((question) => question.question)} não tiveram opções votadas`,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // Método para criação do opções votadas
  async createOptionsVoted(
    optionsVoted: CreateOpcaoVotadaDto[],
    idVote: number,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    // Transforma os dados das opções votadas em uma lista de dicionários do tipo {idVote, idOption} usando map
    const optionsVotedMap = optionsVoted.map((optionVoted) => ({
      voto_id: idVote,
      opcao_id: optionVoted.idOption,
    }));

    // Cria no banco todas as opcoes_votadas
    await prisma.opcao_Votada.createMany({
      data: optionsVotedMap,
    });
  }

  // Pega a hash do último voto. Se não houver voto anterior, um salt é criado
  async getPreviousHash(
    idSurvey,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ): Promise<string> {
    // Busca pelo último voto daquela pesquisa e retorna a sua hash
    const hash: { hash: string }[] = await prisma.$queryRaw`
      SELECT V.hash
      FROM Voto V
      JOIN Opcao_Votada OV ON V.id = OV.voto_id
      JOIN Opcao O ON OV.opcao_id = O.id
      JOIN Pergunta P ON O.pergunta_id = P.id
      WHERE P.pesquisa_id = ${idSurvey}
      ORDER BY V.data DESC
      LIMIT 1;
    `;

    // Se for o primeiro voto daquela pesquisa, cria um Sal e o retorna
    if (hash.length == 0) {
      // Gerando o salt (32 bytes = 256 bits)
      const salt = crypto.randomBytes(32).toString('hex');
      return salt;
    }

    const hashValue = hash[0].hash;
    // Retorna a hash
    return hashValue;
  }

  // Função para gerar uma hash
  async generateHash(previousHash: string, optionsVoted: CreateOpcaoVotadaDto[], date: Date): Promise<string> {
    // Pega os ids das opções votadas
    const optionsVotedIDs = optionsVoted.map((option: CreateOpcaoVotadaDto) => option.idOption);

    const dataVote = {
      previousHash,
      date,
      optionsVotedIDs,
    };

    return crypto.createHash('sha256').update(JSON.stringify(dataVote)).digest('hex');
  }

  // Método para criação do voto
  async createVote(
    hash: string,
    date: Date,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    // Criacao do voto passando sua hash
    const vote = await prisma.voto.create({
      data: {
        hash: hash,
        data: date,
      },
    });

    // Retorna o id do voto criado
    return vote.id;
  }

  // Método para a criação da Participição
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
      const optionsVoted = voto.opcoesVotadas; // Pegando opções votadas

      return await this.prismaService.$transaction(async (prisma) => {
        // Checar se o usuário já votou na pesquisa
        await this.checkUser(idUser, idSurvey, prisma);

        // Checa se as opções votadas estão no Banco
        await this.checkOptions(optionsVoted, prisma);

        // Checar por opções votadas repetidas
        await this.checkDuplicatedOptions(optionsVoted);

        // Checar se as opções pertencem a pergunta
        await this.checkSurvey(idSurvey, optionsVoted, prisma);

        // Checar se todas as perguntas tiverem opções votadas
        await this.checkOptionsPerQuestion(idSurvey, optionsVoted, prisma);

        // Criacao da participação
        await this.createParticipation(idUser, idSurvey, prisma);

        // Geracao da hash
        const previousHash = await this.getPreviousHash(idSurvey, prisma);

        const now = new Date(); // Pega a data e hora atual
        const hash = await this.generateHash(previousHash, optionsVoted, now); // Gera Hash

        // Criação do voto passando a hash
        const idVote = await this.createVote(hash, now, prisma);

        // Criação das Opções Votadas
        await this.createOptionsVoted(optionsVoted, idVote, prisma);

        return hash;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else throw new InternalServerErrorException(error);
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
