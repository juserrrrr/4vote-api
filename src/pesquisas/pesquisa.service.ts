import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerguntaDto } from '../perguntas/dto/create-pergunta.dto';
import { CreateOpcaoDto } from '../opcao/dto/create-opcao.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { CreateTagDto } from '../tag/dto/create-tag.dto';
import { filterPesquisaDto } from './dto/filter-pesquisa.dto';
import * as crypto from 'crypto';
import { MailerService } from '../mailer/mailer.service';
import { UsuariosService } from '../usuarios/usuarios.service';

interface SurveyQueryResult {
  id: number;
  codigo: string;
  titulo: string;
  descricao: string;
  dataTermino: Date;
  ehPublico: boolean;
  URLimagem: string;
  ehVotacao: boolean;
  Pergunta: string;
  PerguntaId: number;
  Opcao: string;
  OpcaoId: number;
}

interface SurveyFilterResult {
  codigo: string;
  titulo: string;
  criador: string;
  descricao: string;
  dataTermino: Date;
  URLimagem: string;
  ehVotacao: boolean;
  tagNome: string[];
}

interface Vote {
  data: string;
  hash: string;
  opcao_id: number[];
}

@Injectable()
export class PesquisaService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly userService: UsuariosService,
  ) {}

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
    const values = createPerguntaDto.map((pergunta) => Prisma.sql`(${pergunta.texto}, ${idPesquisa})`);
    // Cria a query SQL para inserir as perguntas
    const sqlQuery = Prisma.sql`
    INSERT INTO Pergunta (texto, pesquisa_id)
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
      const responseTransaction = await this.prismaService.$transaction(async (prisma) => {
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

        const { email, nome } = await this.userService.findMe(idUser);

        const { titulo, ehPublico } = pesquisa;
        return { codigo, titulo, email, nome, ehPublico };
      });
      //Enviar email se for privada
      if (!responseTransaction.ehPublico) {
        const template = this.mailerService.loadTemplate('codigo-pesquisa-privada');
        const replacements = {
          titulo: responseTransaction.titulo,
          codigo: responseTransaction.codigo,
        };

        const emailHtml = this.mailerService.template(template, replacements);

        await this.mailerService.sendEmail({
          recipients: [{ name: responseTransaction.nome, address: responseTransaction.email }],
          subject: 'Pesquisa privada criada com sucesso',
          html: emailHtml,
        });
      }

      return responseTransaction;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else throw new InternalServerErrorException('Erro interno ao criar uma pesquisa');
    }
  }

  async findAllCodes() {
    try {
      const allCodes = await this.prismaService.$queryRaw`
        SELECT Pesquisa.codigo
        FROM Pesquisa;
      `;

      return allCodes;
    } catch (error) {
      throw new InternalServerErrorException('Erro interno ao buscar as pesquisas');
    }
  }

  // Checar se a pesquisa já foi encerrada
  async checkSurvey(
    code,
    date: Date,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    // Retorna só a data de término da pesquisa
    const survey = await prisma.pesquisa.findUnique({
      where: { codigo: code },
      select: { dataTermino: true },
    });

    // Confere se a pesquisa existe
    if (!survey) {
      throw new NotFoundException(`Pesquisa de codigo ${code} não encontrada`);
    }

    const endDate = survey.dataTermino;
    if (endDate > date) {
      throw new ForbiddenException(`Pesquisa de codigo ${code} ainda não finalizada`);
    }
  }

  async creatorResult(
    idUser: number,
    code: string,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const creator = await prisma.pesquisa.findUnique({
      where: {
        codigo: code,
        criador: idUser,
      },
    });

    if (!creator) {
      throw new ForbiddenException(`Resultado da pesquisa restrito ao criador somente`);
    }
  }

  async votesByOptions(
    code: string,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    try {
      const query: any[] = await prisma.$queryRaw`
      SELECT PE.id AS idQuestion, PE.texto AS textQuestion, O.id AS idOption, O.texto AS textOption, COUNT(OV.voto_id) AS countVotes, O.URLimagem AS imagemOption
      FROM Pesquisa P
      JOIN Pergunta PE ON P.id = PE.pesquisa_id
      JOIN Opcao O ON PE.id = O.pergunta_id
      LEFT JOIN Opcao_Votada OV ON O.id = OV.opcao_id
      WHERE P.codigo = ${code}
      GROUP BY PE.id, O.id;
      `;

      // Uso do reduce para agrupar o resultado da consulta por id da pergunta
      const groupedByPergunta = query.reduce((acc, question) => {
        const countVotes = Number(question.countVotes); // Convertendo tipo "2n" para number "2"

        // Verifica se a pergunta já foi adicionada
        const questionIndex = acc.findIndex((item) => item.texto === question.textQuestion);

        // Caso a pergunta não tenha sido adicionada ainda
        if (questionIndex === -1) {
          acc.push({
            texto: question.textQuestion,
            opcoes: [{ textoOpcao: question.textOption, quantVotos: countVotes, URLimagem: question.imagemOption }],
            total: countVotes,
          });
        } else {
          // Atualiza a opção existente ou adiciona uma nova
          const optionIndex = acc[questionIndex].opcoes.findIndex((opt) => opt.textoOpcao === question.textOption);

          if (optionIndex === -1) {
            acc[questionIndex].opcoes.push({
              textoOpcao: question.textOption,
              quantVotos: countVotes,
              URLimagem: question.imagemOption,
            });
          } else {
            acc[questionIndex].opcoes[optionIndex].quantVotos += countVotes;
          }

          // Atualiza o total de votos da pergunta
          acc[questionIndex].total += countVotes;
        }

        return acc;
      }, []);

      // Adiciona a porcentagem e identifica a opção mais votada
      groupedByPergunta.forEach((question) => {
        let maxVotes = 0;

        question.opcoes.forEach((opcao) => {
          opcao.porcentagem = (opcao.quantVotos / question.total) * 100;

          if (opcao.quantVotos > maxVotes) {
            maxVotes = opcao.quantVotos;
          }
        });

        question.opcoes.forEach((opcao) => {
          opcao.opcaoMaisVotada = opcao.quantVotos === maxVotes;
        });
      });

      return groupedByPergunta;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
      }
    }
  }

  async getResultado(idUser: number, code: string) {
    try {
      const now = new Date(); // Pega a data e hora atual

      return await this.prismaService.$transaction(async (prisma) => {
        // Checa se é o criador que quer ver o resultado
        await this.creatorResult(idUser, code, prisma);

        // Checar se a pesquisa existe e se já foi encerrada
        await this.checkSurvey(code, now, prisma);

        // Pega os resultados da pesquisa
        const votes = await this.votesByOptions(code, prisma);

        return votes;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      } else throw new InternalServerErrorException('Erro interno ao criar uma participação');
    }
  }

  async findByCode(code: string) {
    try {
      //Puxar as informações de perguntas e opções
      const surverys = await this.prismaService.$queryRaw<SurveyQueryResult[]>`
        SELECT Pesquisa.id, Pesquisa.codigo, Pesquisa.titulo, Pesquisa.descricao, Pesquisa.dataTermino, Pesquisa.criador, Pesquisa.ehPublico, Pesquisa.URLimagem, Pesquisa.ehVotacao, Pergunta.texto AS Pergunta, Pergunta.id AS PerguntaId, Opcao.id  AS OpcaoId, Opcao.texto AS Opcao
        FROM Pesquisa
        LEFT JOIN Pergunta ON Pesquisa.id = Pergunta.pesquisa_id
        LEFT JOIN Opcao ON Pergunta.id = Opcao.pergunta_id
        WHERE Pesquisa.codigo = ${code};
        `;

      // Transformar o resultado em um objeto com as perguntas e opções
      const result = surverys.reduce((acc, survey) => {
        // Verifica se a pesquisa já foi adicionada
        const surveyIndex = acc.findIndex((item) => item.codigo === survey.codigo);
        // Caso a pesquisa não tenha sido adicionada ainda ela é adicionada
        if (surveyIndex === -1) {
          acc.push({
            id: survey.id,
            codigo: survey.codigo,
            titulo: survey.titulo,
            descricao: survey.descricao,
            dataTermino: survey.dataTermino,
            ehPublico: survey.ehPublico,
            URLimagem: survey.URLimagem,
            ehVotacao: survey.ehVotacao,
            perguntas: [
              { id: survey.PerguntaId, texto: survey.Pergunta, opcoes: [{ id: survey.OpcaoId, texto: survey.Opcao }] },
            ],
          });
          // Caso a pesquisa já tenha sido adicionada, é adicionada a pergunta e a opção
        } else {
          // Verifica se a pergunta já foi adicionada
          const questionIndex = acc[surveyIndex].perguntas.findIndex((question) => question.texto === survey.Pergunta);
          // Caso a pergunta não tenha sido adicionada ainda ela é adicionada
          if (questionIndex === -1) {
            acc[surveyIndex].perguntas.push({
              id: survey.OpcaoId,
              texto: survey.Pergunta,
              opcoes: [{ id: survey.OpcaoId, texto: survey.Opcao }],
            });
            // Caso a pergunta já tenha sido adicionada, é adicionada a opção
          } else {
            acc[surveyIndex].perguntas[questionIndex].opcoes.push({ id: survey.OpcaoId, texto: survey.Opcao });
          }
        }
        return acc;
      }, []);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Erro interno ao buscar as pesquisas');
    }
  }

  private async groupTagBySurvey(surveys: SurveyFilterResult[]) {
    const surveysGrouped = surveys.reduce((acc, survey) => {
      // Verifica se a pesquisa já foi adicionada
      const surveyIndex = acc.findIndex((item) => item.codigo === survey.codigo);
      // Caso a pesquisa não tenha sido adicionada ainda ela é adicionada
      if (surveyIndex === -1) {
        acc.push({
          codigo: survey.codigo,
          titulo: survey.titulo,
          criador: survey.criador,
          descricao: survey.descricao,
          dataTermino: survey.dataTermino,
          URLimagem: survey.URLimagem,
          ehVotacao: survey.ehVotacao,
          tags: survey.tagNome ? [survey.tagNome] : [],
        });
        // Caso a pesquisa já tenha sido adicionada, é adicionada a tag
      } else {
        acc[surveyIndex].tags.push(survey.tagNome);
      }
      return acc;
    }, []);
    return surveysGrouped;
  }

  async filterSurveys(
    { arquivada = false, criador = false, encerradas = false, participo = false }: filterPesquisaDto,
    idUser: number,
  ) {
    // Inicializa a query SQL para buscar as pesquisas padrão
    let querySql = Prisma.sql`
      SELECT p.codigo, p.titulo, p.descricao, p.dataTermino, p.criador, p.URLimagem, p.ehVotacao, t.nome AS tagNome
      FROM Pesquisa p
      LEFT JOIN Tag_Pesquisa tp ON p.id = tp.pesquisa_id
      LEFT JOIN Tag t ON tp.tag_id = t.id
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
      const surveys = await this.prismaService.$queryRaw<SurveyFilterResult[]>(querySql);
      const surveysGrouped = await this.groupTagBySurvey(surveys);
      return surveysGrouped;
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

  //Método para auditoria da pesquisa
  async auditSurvey(codeSurvey: string) {
    const now = new Date(); // Pegando a data de agora
    // Remove os milissegundos
    now.setMilliseconds(0);
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        // Checando se a pesquisa existe e já foi finalizada
        this.checkSurvey(codeSurvey, now, prisma);
        const query = await prisma.$queryRaw<Vote[]>`
          SELECT V.data, V.hash, OV.opcao_id
          FROM Voto V
          JOIN Opcao_Votada OV ON V.id = OV.voto_id
          JOIN Opcao O ON OV.opcao_id = O.id
          JOIN Pergunta P ON O.pergunta_id = P.id
          JOIN Pesquisa PE ON P.pesquisa_id = PE.id
          WHERE PE.codigo = ${codeSurvey}
          ORDER BY V.data;
          `;

        const votesSurvey = query.reduce((acc, current) => {
          const { hash, data, opcao_id } = current;

          if (!acc[hash]) {
            acc[hash] = { data, opcao_id: [] };
          }

          acc[hash].opcao_id.push(opcao_id);

          return acc;
        }, {});

        // Hashs obtidas pela auditoria
        const hashsAudit = [];

        // Valores booleanos para cada voto (true - ok, false - pesquisa fraudada)
        const results = [];

        Object.entries(votesSurvey).forEach(([key, value], index) => {
          const { data, opcao_id } = value as Vote; // Pega os dados do voto para geraçaõ da hash

          // Se o voto for o primeiro da pesquisa, pega o Sal da env, senão, pega a hash anterior
          const previousHash = index == 0 ? process.env.SALT : hashsAudit[index - 1];
          const date = new Date(data);
          const optionsVotedIDs = opcao_id;

          // Dados obtido do voto pela auditoria
          const dataVote = {
            previousHash,
            date,
            optionsVotedIDs,
          };

          // Geração da hash pela auditoria
          const hashVerificacao = crypto.createHash('sha256').update(JSON.stringify(dataVote)).digest('hex');

          // Insere a hash da auditoria no Banco
          hashsAudit.push(hashVerificacao);

          // Se a Hash coletada do Banco para aquele Voto for a mesma da Hash salva, retorna True, senão, False(Fraudada)
          // console.log(`Hash do voto no Banco: ${key}\nHash gerada pela auditoria: ${hashVerificacao}`);
          // console.log(hashVerificacao == key);
          results.push(hashVerificacao == key);
        });

        const validSurvey = results.every((result) => result); //Verifica se tudo deu true (Pesquisa validada)
        return validSurvey ? 'Pesquisa sem fraudes' : 'Pesquisa Fraudada!';
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      } else throw new InternalServerErrorException('Erro interno ao criar uma participação');
    }
  }
}
