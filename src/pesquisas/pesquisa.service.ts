import { Injectable } from '@nestjs/common';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PesquisaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreatePesquisaDto) {
    const pesquisa = await this.prisma.pesquisa.create({ data: body });
    return pesquisa;
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
