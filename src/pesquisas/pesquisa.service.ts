import { Injectable } from '@nestjs/common';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerguntaDto } from 'src/perguntas/dto/create-pergunta.dto';
import { CreateOpcaoDto } from 'src/opcao/dto/create-opcao.dto';

@Injectable()
export class PesquisaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createPesquisaDto: CreatePesquisaDto,
    createPerguntaDto: CreatePerguntaDto,
    createOpcaoDto: CreateOpcaoDto,
  ) {
    return await this.prisma.$transaction(async (prisma) => {
      const pesquisa = await prisma.pesquisa.create({
        data: createPesquisaDto,
      });
      const pesquisaId = pesquisa.id;

      const pergunta = await prisma.$queryRaw`
      INSERT INTO Pergunta (texto, URLimagem, pesquisa_id)
      VALUES (${createPerguntaDto.texto}, ${createPerguntaDto.URLimagem}, ${pesquisaId})
      RETURNING id
    `;
      const perguntaId = pergunta[0].id;

      const opcao = await prisma.$queryRaw`
      INSERT INTO Opcao (pergunta_id, texto, quantVotos)
      VALUES (${perguntaId}, ${createOpcaoDto.texto}, ${createOpcaoDto.quantVotos})
      RETURNING id
    `;
      const opcaoId = opcao[0].id;

      return { pesquisaId, perguntaId, opcaoId };
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
