import { Injectable } from '@nestjs/common';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { UpdatePesquisaDto } from './dto/update-pesquisa.dto';
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
    return await this.prisma.pesquisa.findMany();
  }

  async getById(id: number) {
    return await this.prisma.pesquisa.findUnique({
      where: { id },
    });
  }

  async update(body: UpdatePesquisaDto, id: number) {
    return await this.prisma.pesquisa.update({
      where: { id },
      data: body,
    });
  }

  async delete(id: number) {
    return await this.prisma.pesquisa.delete({
      where: { id },
    });
  }
}
