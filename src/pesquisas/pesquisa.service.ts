import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerguntaDto } from '../perguntas/dto/create-pergunta.dto';
import { CreateOpcaoDto } from '../opcao/dto/create-opcao.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
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
    createPerguntaDto: Omit<CreatePesquisaDto, 'perguntas' | 'opcoes'>,
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
    const idPesquisa = Number(result[0].id);
    return idPesquisa ? idPesquisa : null;
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
    SELECT id FROM Pergunta WHERE pesquisa_id = ${idPesquisa} ORDER BY id DESC LIMIT ${createPerguntaDto.length}
  `;

    // Retorna os IDs das perguntas criadas
    const idsPergunta = resultIds.map((pergunta) => pergunta.id).reverse();
    return idsPergunta ? idsPergunta : null;
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
    const valuesPlaceholder = createOpcaoDto.map(() => '(?, ?, ?)').join(',');
    // Cria a query SQL para inserir as opções
    const sqlQuery = `INSERT INTO Opcao (texto, quantVotos, pergunta_id) VALUES ${valuesPlaceholder}`;
    // Cria um array com os parâmetros para a query SQL
    const params = createOpcaoDto.flatMap((opcao) => [opcao.texto, opcao.quantVotos, idPergunta]);
    // Executa a query SQL
    await prisma.$executeRawUnsafe(sqlQuery, ...params);
  }

  async create(createPesquisaDto: CreatePesquisaDto, idUser: number) {
    try {
      // Gera um código aleatório
      const codigo = await this.generateUniqueCode();

      return await this.prismaService.$transaction(async (prisma) => {
        const { perguntas, ...pesquisa } = createPesquisaDto;
        const idPesquisa = await this.createSurvey(pesquisa, idUser, codigo, prisma);
        const idsPergunta = await this.createQuestions(idPesquisa, perguntas, prisma);
        await Promise.all(
          idsPergunta.map((idPergunta, index) => this.createOptions(idPergunta, perguntas[index].opcoes, prisma)),
        );
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
    const pesquisas = await this.prismaService.pesquisa.findMany();
    return pesquisas;
  }

  async getById(id: number) {
    const pesquisa = await this.prismaService.pesquisa.findUnique({
      where: { id },
    });
    return pesquisa;
  }

  async updateArquivar(id: number) {
    const pesquisaArquivada = await this.prismaService.pesquisa.update({
      where: { id },
      data: { arquivado: true },
    });
    return pesquisaArquivada;
  }
}
