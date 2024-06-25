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

      const pergunta = await prisma.pergunta.create({
        data: {
          texto: createPerguntaDto.texto,
          URLimagem: createPerguntaDto.URLimagem,
          pesquisa_id: pesquisa.id,
        },
      });

      const opcao = await prisma.opcao.create({
        data: {
          pergunta_id: pergunta.id,
          texto: createOpcaoDto.texto,
          quantVotos: createOpcaoDto.quantVotos,
        },
      });

      return { pesquisa, pergunta, opcao };
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
