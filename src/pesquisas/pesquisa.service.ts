import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerguntaDto } from '../perguntas/dto/create-pergunta.dto';
import { CreateOpcaoDto } from '../opcao/dto/create-opcao.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { CreateTagDto } from '../tag/dto/create-tag.dto';
import { filterPesquisaDto } from './dto/filter-pesquisa.dto';
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

  async checkExistingTags(
    tags: CreateTagDto[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const tagsNames = tags.map((tag) => tag.nome);
    const valuesPlaceholder = tagsNames.map(() => '?').join(',');
    const sqlQuery = `SELECT id, nome FROM Tag WHERE nome IN (${valuesPlaceholder})`;
    const result = await prisma.$queryRawUnsafe<{ id: number; nome: string }[]>(sqlQuery, ...tagsNames);
    const existingTags = result.map((tag) => tag.nome);
    return existingTags;
  }

  async createTags(
    tags: CreateTagDto[],
    existingTags: string[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ): Promise<number[]> {
    // Filtra as tags que não existem
    const newTags = tags.filter((tag) => !existingTags.includes(tag.nome));
    // Verifica se existem tags para serem criadas
    if (newTags.length > 0) {
      // Cria um placeholder para cada tag
      const valuesPlaceholder = newTags.map(() => '(?)').join(',');
      // Cria a query SQL para inserir as tags
      const sqlQuery = `INSERT INTO Tag (nome) VALUES ${valuesPlaceholder}`;
      // Cria um array com os parâmetros para a query SQL
      const newParamsTags = tags.map((tag) => tag.nome);
      // Executa a query SQL
      await prisma.$executeRawUnsafe(sqlQuery, ...newParamsTags);
    }

    // Cria um array com os parâmetros para a query SQL
    const paramsTags = tags.map((tag) => tag.nome);
    // Busca os IDs das tags criadas, usando placeholder e paramsTags
    const valuesPlaceholderTags = tags.map(() => '?').join(',');
    const sqlQueryTags = `SELECT id FROM Tag WHERE nome IN (${valuesPlaceholderTags})`;
    // busca os ids das tags criadas
    const resultIds = await prisma.$queryRawUnsafe<{ id: number }[]>(sqlQueryTags, ...paramsTags);
    const tagIds = resultIds.flatMap((tag) => tag.id);

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
      // Separa as perguntas, tags e os demais dados da pesquisa
      const { perguntas, tags, ...pesquisa } = createPesquisaDto;
      return await this.prismaService.$transaction(async (prisma) => {
        // Cria a pesquisa e retorna o código
        const surveyId = await this.createSurvey(pesquisa, idUser, codigo, prisma);
        // Cria as perguntas e retorna os IDs
        const idsPergunta = await this.createQuestions(surveyId, perguntas, prisma);
        // Cria as opções das perguntas
        await Promise.all(
          idsPergunta.map((idPergunta, index) => this.createOptions(idPergunta, perguntas[index].opcoes, prisma)),
        );
        // Verifica se as tags já existem e retorna as que existem
        const existingTags = await this.checkExistingTags(tags, prisma);
        // Cria as tags que não existem e retorna os IDs
        const idsTags = await this.createTags(tags, existingTags, prisma);
        // Sincroniza as tags com a pesquisa
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

  //Criar um filtro para mostrar as pesquisas arquivadas pelo proprio usuario que criou, as que ele participou e as encerradas
  //Os valores vão ser passador por query params
  async filterSurveys(
    { arquivada = false, criador = false, encerradas = false, participo = false }: filterPesquisaDto,
    idUser: number,
  ) {
    // Inicializa a query SQL para buscar as pesquisas padrão
    let querySql = Prisma.sql`
      SELECT p.*
      FROM Pesquisa p
    `;

    // Verifica se o filtro de participação está ativo
    if (participo) {
      querySql = Prisma.sql`
        ${querySql}
        JOIN Participacao pt ON p.id = pt.pesquisa_id
      `;
    }

    // Adiciona as condições do filtro que não dependem tanto do parâmetro
    querySql = Prisma.sql`
      ${querySql}
      WHERE p.arquivado = ${arquivada}
      AND p.dataTermino ${encerradas ? Prisma.sql`<` : Prisma.sql`>=`} NOW()
    `;

    // Adiciona condições que dependem de outros parâmetros
    if (participo) {
      querySql = Prisma.sql`
        ${querySql}
        AND pt.usuario_id = ${idUser}
      `;
    }
    if (criador) {
      querySql = Prisma.sql`
        ${querySql}
        AND p.criador = ${idUser}
      `;
    }

    try {
      const surveys = await this.prismaService.$queryRaw(querySql);
      return surveys;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
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
