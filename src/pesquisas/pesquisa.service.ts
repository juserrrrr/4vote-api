import { Injectable } from '@nestjs/common';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerguntaDto } from '../perguntas/dto/create-pergunta.dto';
import { CreateOpcaoDto } from '../opcao/dto/create-opcao.dto';
@Injectable()
export class PesquisaService {
  constructor(private readonly prisma: PrismaService) {}

  async createSurvey(
    createPerguntaDto: Omit<CreatePesquisaDto, 'perguntas' | 'opcoes'>,
    idUser: number,
  ): Promise<number> {
    await this.prisma.$executeRaw`
      INSERT INTO Pesquisa (codigo, criador, titulo, descricao, dataTermino, ehPublico, URLimagem, ehVotacao)
      VALUES (${createPerguntaDto.codigo}, ${idUser}, ${createPerguntaDto.titulo}, ${createPerguntaDto.descricao}, ${createPerguntaDto.dataTermino}, ${createPerguntaDto.ehPublico}, ${createPerguntaDto.URLimagem}, ${createPerguntaDto.ehVotacao})
    `;
    const result = await this.prisma.$queryRaw`
      SELECT LAST_INSERT_ID() as id;
    `;
    const idPesquisa = Number(result[0].id);
    return idPesquisa ? idPesquisa : null;
  }

  async createQuestions(idPesquisa: number, createPerguntaDto: CreatePerguntaDto[]): Promise<number> {
    return await this.prisma.$queryRaw`
      INSERT INTO Pergunta (texto, pesquisa_id, URLimagem) ()
      VALUES ${createPerguntaDto.map((pergunta) => `(${pergunta.texto}, ${idPesquisa}, ${pergunta.URLimagem})`).join(',')}
    `;
  }

  // async createOptions(idPergunta: number, createOpcaoDto: CreateOpcaoDto[]) {
  //   return await this.prisma.$queryRaw`
  //     INSERT INTO Opcao (pergunta_id, texto, quantVotos)
  //     VALUES (${createOpcaoDto.pergunta_id}, ${createOpcaoDto.texto}, ${createOpcaoDto.quantVotos})
  //   `;
  // }

  async create(createPesquisaDto: CreatePesquisaDto, idUser: number) {
    return await this.prisma.$transaction(async () => {
      const { perguntas, opcoes, ...pesquisa } = createPesquisaDto;
      const idPesquisa = await this.createSurvey(pesquisa, idUser);
      console.log(idPesquisa);
      return idPesquisa;
    });
  }

  async findAll() {
    const pesquisas = await this.prisma.pesquisa.findMany();
    return pesquisas;
  }

  async getById(id: number) {
    const pesquisa = await this.prisma.pesquisa.findUnique({
      where: { id },
    });
    return pesquisa;
  }

  async updateArquivar(id: number) {
    const pesquisaArquivada = await this.prisma.pesquisa.update({
      where: { id },
      data: { arquivado: true },
    });
    return pesquisaArquivada;
  }
}
