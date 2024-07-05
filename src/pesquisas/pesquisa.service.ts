import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerguntaDto } from '../perguntas/dto/create-pergunta.dto';
import { CreateOpcaoDto } from '../opcao/dto/create-opcao.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { CreateTagDto } from '../tag/dto/create-tag.dto';
@Injectable()
export class PesquisaService {
  constructor(private readonly prismaService: PrismaService) {}

  // Função para gerar um código aleatório
  // Necessario verificar um solução mais eficiente, segura e escalável
  private async generateUniqueCode(): Promise<string> {
    let isUnique = false;
    let uniqueCode = '';
    while (!isUnique) {
      uniqueCode = Math.random().toString(36).substring(2, 8); // Gera um código aleatório
      const existing = await this.prismaService.pesquisa.findUnique({
        where: { codigo: uniqueCode },
      });
      if (!existing) {
        isUnique = true;
      }
    }
    return uniqueCode;
  }

  // Função para criar uma pesquisa
  async createSurvey(
    createPerguntaDto: Omit<CreatePesquisaDto, 'perguntas' | 'opcoes' | 'tags'>,
    idUser: number,
    codigo: string,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ): Promise<number> {
    // Executa a query SQL para inserir a pesquisa
    await prisma.$executeRaw`
      INSERT INTO Pesquisa (codigo, criador, titulo, descricao, dataTermino, ehPublico, URLimagem, ehVotacao)
      VALUES (${codigo}, ${idUser}, ${createPerguntaDto.titulo}, ${createPerguntaDto.descricao}, ${createPerguntaDto.dataTermino}, ${createPerguntaDto.ehPublico}, ${createPerguntaDto.URLimagem}, ${createPerguntaDto.ehVotacao})
    `;
    // Busca o ID da pesquisa criada
    const result = await prisma.$queryRaw`
      SELECT LAST_INSERT_ID() as id;
    `;
    // Retorna o ID da pesquisa criada
    const surveyId = Number(result[0].id);
    return surveyId ? surveyId : null;
  }

  // Função para criar as perguntas de uma pesquisa
  async createQuestions(
    idPesquisa: number,
    createPerguntaDto: CreatePerguntaDto[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ): Promise<number[]> {
    // Cria um placeholder para cada pergunta
    const valuesPlaceholder = createPerguntaDto.map(() => '(?, ?, ?)').join(',');
    // Cria a query SQL para inserir as perguntas
    const sqlQuery = `INSERT INTO Pergunta (texto, pesquisa_id, URLimagem) VALUES ${valuesPlaceholder}`;
    // Cria um array com os parâmetros para a query SQL
    const params = createPerguntaDto.flatMap((pergunta) => [pergunta.texto, idPesquisa, pergunta.URLimagem]);
    // Executa a query SQL
    await prisma.$executeRawUnsafe(sqlQuery, ...params);

    // Busca os IDs das perguntas criadas
    const resultIds = await prisma.$queryRaw<{ id: number }[]>`
    SELECT id FROM Pergunta WHERE pesquisa_id = ${idPesquisa}
  `;

    // Retorna os IDs das perguntas criadas
    const questionIds = resultIds.map((pergunta) => pergunta.id);
    return questionIds ? questionIds : null;
  }

  // Função para criar as opções de uma pergunta
  async createOptions(
    idPergunta: number,
    createOpcaoDto: CreateOpcaoDto[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    // Cria um placeholder para cada opção
    const valuesPlaceholder = createOpcaoDto.map(() => '(?, ?)').join(',');
    // Cria a query SQL para inserir as opções
    const sqlQuery = `INSERT INTO Opcao (texto, pergunta_id) VALUES ${valuesPlaceholder}`;
    // Cria um array com os parâmetros para a query SQL
    const params = createOpcaoDto.flatMap((opcao) => [opcao.texto, idPergunta]);
    // Executa a query SQL
    await prisma.$executeRawUnsafe(sqlQuery, ...params);
  }

  async createTags(
    tags: CreateTagDto[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ): Promise<number[]> {
    // Cria um placeholder para cada tag
    const valuesPlaceholder = tags.map(() => '(?)').join(',');
    // Cria a query SQL para inserir as tags
    const sqlQuery = `INSERT INTO Tag (nome) VALUES ${valuesPlaceholder}`;
    // Cria um array com os parâmetros para a query SQL
    const params = tags.flatMap((tag) => [tag.nome]);
    // Executa a query SQL
    await prisma.$executeRawUnsafe(sqlQuery, ...params);

    // Busca os IDs das tags criadas, usando placeholder e params
    const valuesPlaceholderTags = tags.map(() => '?').join(',');
    const sqlQueryTags = `SELECT id FROM Tag WHERE nome IN (${valuesPlaceholderTags})`;
    const resultIds = await prisma.$queryRawUnsafe<{ id: number }[]>(sqlQueryTags, ...params);

    const tagIds = resultIds.map((tag) => tag.id);
    return tagIds ? tagIds : null;
  }

  async createSyncTagSurvery(
    idSurvey: number,
    idsTag: number[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    // Cria um placeholder para cada tag
    const valuesPlaceholder = idsTag.map(() => '(?, ?)').join(',');
    // Cria a query SQL para inserir as tags
    const sqlQuery = `INSERT INTO Tag_Pesquisa (pesquisa_id, tag_id) VALUES ${valuesPlaceholder}`;
    // Cria um array com os parâmetros para a query SQL
    const params = idsTag.flatMap((idTag) => [idSurvey, idTag]);
    // Executa a query SQL
    await prisma.$executeRawUnsafe(sqlQuery, ...params);
  }

  async create(createPesquisaDto: CreatePesquisaDto, idUser: number) {
    try {
      // Gera um código aleatório
      const codigo = await this.generateUniqueCode();
      return await this.prismaService.$transaction(async (prisma) => {
        const { perguntas, tags, ...pesquisa } = createPesquisaDto;

        const surveyId = await this.createSurvey(pesquisa, idUser, codigo, prisma);

        const idsPergunta = await this.createQuestions(surveyId, perguntas, prisma);
        await Promise.all(
          idsPergunta.map((idPergunta, index) => this.createOptions(idPergunta, perguntas[index].opcoes, prisma)),
        );

        const idsTags = await this.createTags(tags, prisma);
        await this.createSyncTagSurvery(surveyId, idsTags, prisma);

        const { titulo } = pesquisa;
        return { codigo, titulo };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else throw new InternalServerErrorException('Erro interno ao criar uma pesquisa');
    }
  }

  async findAll() {
    try {
      const surverys = await this.prismaService.$queryRaw`
        SELECT Pesquisa.id, Pesquisa.titulo, Pesquisa.descricao, Pesquisa.dataTermino, Pesquisa.ehPublico, Pesquisa.URLimagem, Pesquisa.ehVotacao
        FROM Pesquisa
        WHERE Pesquisa.arquivado = false AND Pesquisa.dataTermino >= NOW()
        `;
      return surverys;
    } catch (error) {
      throw new InternalServerErrorException('Erro interno ao buscar as pesquisas');
    }
  }

  async getById(id: number) {
    try {
      const survery = await this.prismaService.$queryRaw`
        SELECT Pesquisa.id, Pesquisa.titulo, Pesquisa.descricao, Pesquisa.dataTermino, Pesquisa.ehPublico, Pesquisa.URLimagem, Pesquisa.ehVotacao
        FROM Pesquisa
        WHERE Pesquisa.id = ${id}
        `;
      return survery;
    } catch (error) {
      throw new InternalServerErrorException('Erro interno ao buscar a pesquisa');
    }
  }

  async updateArquivar(idSurvey: number, idUser: number) {
    const survery = await this.prismaService.pesquisa.findUnique({
      where: { id: idSurvey },
      select: { criador: true, arquivado: true },
    });
    // Verifica se a pesquisa existe
    if (!survery) {
      throw new HttpException('Pesquisa não encontrada', HttpStatus.NOT_FOUND);
    }
    // Verifica se o usuário é o criador da pesquisa
    if (survery.criador !== idUser) {
      throw new HttpException('Usuário não autorizado', HttpStatus.UNAUTHORIZED);
    }
    // Verifica se a pesquisa já foi arquivada
    if (survery.arquivado) {
      throw new HttpException('Pesquisa já arquivada', HttpStatus.BAD_REQUEST);
    }
    // Arquiva a pesquisa
    try {
      const surveryArchived = await this.prismaService.pesquisa.update({
        where: { id: idSurvey },
        data: { arquivado: true },
        select: { titulo: true, arquivado: true },
      });
      return surveryArchived;
    } catch (error) {
      throw new InternalServerErrorException('Erro interno ao arquivar a pesquisa');
    }
  }
}
