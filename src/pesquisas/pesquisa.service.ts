import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerguntaDto } from '../perguntas/dto/create-pergunta.dto';
import { CreateOpcaoDto } from '../opcao/dto/create-opcao.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { CreateTagDto } from '../tag/dto/create-tag.dto';
import { filterPesquisaDto } from './dto/filter-pesquisa.dto';

interface SurveyQueryResult {
  codigo: string;
  titulo: string;
  descricao: string;
  dataTermino: Date;
  ehPublico: boolean;
  URLimagem: string;
  ehVotacao: boolean;
  Pergunta: string;
  Opcao: string;
}
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
    await prisma.$executeRaw(Prisma.sql`
    INSERT INTO Pesquisa (codigo, criador, titulo, descricao, dataTermino, ehPublico, URLimagem, ehVotacao)
    VALUES (${codigo}, ${idUser}, ${createPerguntaDto.titulo}, ${createPerguntaDto.descricao}, ${createPerguntaDto.dataTermino}, ${createPerguntaDto.ehPublico}, ${createPerguntaDto.URLimagem}, ${createPerguntaDto.ehVotacao})
    `);
    // Busca o ID da pesquisa criada
    const result = await prisma.$queryRaw<{ id: number }[]>(Prisma.sql`
    SELECT LAST_INSERT_ID() as id;
    `);
    // Retorna o ID da pesquisa criada
    const surveyId = Number(result[0].id);
    return surveyId || null;
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
    // Cria um array de valores SQL para os placeholders
    const values = createPerguntaDto.map(
      (pergunta) => Prisma.sql`(${pergunta.texto}, ${idPesquisa}, ${pergunta.URLimagem})`,
    );
    // Cria a query SQL para inserir as perguntas
    const sqlQuery = Prisma.sql`
    INSERT INTO Pergunta (texto, pesquisa_id, URLimagem)
    VALUES ${Prisma.join(values, `, `)}
    `;
    // Executa a query SQL
    await prisma.$executeRaw(sqlQuery);
    // Busca os IDs das perguntas criadas
    const resultIds = await prisma.$queryRaw<{ id: number }[]>(Prisma.sql`
    SELECT id FROM Pergunta WHERE pesquisa_id = ${idPesquisa}
    `);
    // Retorna os IDs das perguntas criadas
    const questionIds = resultIds.map((pergunta) => pergunta.id);
    return questionIds || null;
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
    // Cria um array de valores SQL para os placeholders
    const values = createOpcaoDto.map((opcao) => Prisma.sql`(${opcao.texto}, ${idPergunta})`);
    // Cria a query SQL para inserir as opções
    const sqlQuery = Prisma.sql`
    INSERT INTO Opcao (texto, pergunta_id)
    VALUES ${Prisma.join(values, `, `)}
    `;
    // Executa a query SQL
    await prisma.$executeRaw(sqlQuery);
  }

  async checkExistingTags(
    tags: CreateTagDto[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const tagsNames = tags.map((tag) => tag.nome);
    // Constrói a query SQL usando Prisma.sql
    const sqlQuery = Prisma.sql`
      SELECT id, nome FROM Tag
      WHERE nome IN (${Prisma.join(tagsNames, `, `)})
    `;
    // Executa a query SQL
    const result = await prisma.$queryRaw<{ id: number; nome: string }[]>(sqlQuery);
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
      // Cria um array de valores SQL para os placeholders
      const values = newTags.map((tag) => Prisma.sql`(${tag.nome})`);
      // Cria a query SQL para inserir as tags
      const sqlQuery = Prisma.sql`
      INSERT INTO Tag (nome)
      VALUES ${Prisma.join(values, `, `)}
      `;
      // Executa a query SQL
      await prisma.$executeRaw(sqlQuery);
    }
    // Cria um array com os parâmetros para a query SQL
    const paramsTags = tags.map((tag) => tag.nome);

    // Cria a query SQL para buscar os IDs das tags criadas
    const sqlQueryTags = Prisma.sql`
    SELECT id FROM Tag
    WHERE nome IN (${Prisma.join(paramsTags, `, `)})
    `;
    // Busca os IDs das tags criadas
    const resultIds = await prisma.$queryRaw<{ id: number }[]>(sqlQueryTags);
    const tagIds = resultIds.map((tag) => tag.id);

    return tagIds.length > 0 ? tagIds : null;
  }

  async createSyncTagSurvery(
    idSurvey: number,
    idsTag: number[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    // Cria um array de valores SQL para os placeholders
    const values = idsTag.map((idTag) => Prisma.sql`(${idSurvey}, ${idTag})`);
    // Constrói a query SQL
    const sqlQuery = Prisma.sql`
    INSERT INTO Tag_Pesquisa (pesquisa_id, tag_id)
    VALUES ${Prisma.join(values, `, `)}
    `;
    // Executa a query SQL
    await prisma.$executeRaw(sqlQuery);
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
        if (tags?.length > 0) {
          // Verifica se as tags já existem e retorna as que existem
          const existingTags = await this.checkExistingTags(tags, prisma);
          // Cria as tags que não existem e retorna os IDs
          const idsTags = await this.createTags(tags, existingTags, prisma);
          // Sincroniza as tags com a pesquisa
          await this.createSyncTagSurvery(surveyId, idsTags, prisma);
        }

        const { titulo } = pesquisa;
        return { codigo, titulo };
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else throw new InternalServerErrorException('Erro interno ao criar uma pesquisa');
    }
  }

  async findByCode(code: string) {
    try {
      //Puxar as informações de perguntas e opções
      const surverys = await this.prismaService.$queryRaw<SurveyQueryResult[]>`
        SELECT Pesquisa.codigo, Pesquisa.titulo, Pesquisa.descricao, Pesquisa.dataTermino, Pesquisa.ehPublico, Pesquisa.URLimagem, Pesquisa.ehVotacao, Pergunta.texto AS Pergunta, Opcao.texto AS Opcao
        FROM Pesquisa
        JOIN Pergunta ON Pesquisa.id = Pergunta.pesquisa_id
        JOIN Opcao ON Pergunta.id = Opcao.pergunta_id
        WHERE Pesquisa.codigo = ${code}
        `;
      // Transformar o resultado em um objeto com as perguntas e opções
      const result = surverys.reduce((acc, survey) => {
        // Verifica se a pesquisa já foi adicionada
        const surveyIndex = acc.findIndex((item) => item.codigo === survey.codigo);
        // Caso a pesquisa não tenha sido adicionada ainda ela é adicionada
        if (surveyIndex === -1) {
          acc.push({
            codigo: survey.codigo,
            titulo: survey.titulo,
            descricao: survey.descricao,
            dataTermino: survey.dataTermino,
            ehPublico: survey.ehPublico,
            URLimagem: survey.URLimagem,
            ehVotacao: survey.ehVotacao,
            perguntas: [{ texto: survey.Pergunta, opcoes: [survey.Opcao] }],
          });
          // Caso a pesquisa já tenha sido adicionada, é adicionada a pergunta e a opção
        } else {
          // Verifica se a pergunta já foi adicionada
          const questionIndex = acc[surveyIndex].perguntas.findIndex((question) => question.texto === survey.Pergunta);
          // Caso a pergunta não tenha sido adicionada ainda ela é adicionada
          if (questionIndex === -1) {
            acc[surveyIndex].perguntas.push({ texto: survey.Pergunta, opcoes: [survey.Opcao] });
            // Caso a pergunta já tenha sido adicionada, é adicionada a opção
          } else {
            acc[surveyIndex].perguntas[questionIndex].opcoes.push(survey.Opcao);
          }
        }
        return acc;
      }, []);
      return result;
    } catch (error) {
      console.log(error);
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
      SELECT p.codigo, p.titulo, p.descricao, p.dataTermino, p.URLimagem
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
