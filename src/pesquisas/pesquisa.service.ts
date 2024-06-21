import { Injectable } from '@nestjs/common';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { UpdatePesquisaDto } from './dto/update-pesquisa.dto';
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
    const pesquisas = await this.prisma.pesquisa.findUnique({
      where: { id },
    });
    return pesquisas;
  }

  async update(body: UpdatePesquisaDto, id: number) {
    const pesquisaAtualizada = await this.prisma.pesquisa.update({
      where: { id },
      data: body,
    });
    return pesquisaAtualizada;
  }

  async updateArquivar(id: number) {
    const pesquisaArquivada = await this.prisma.pesquisa.update({
      where: { id },
      data: { arquivado: true },
    });
    return pesquisaArquivada;
  }

  async delete(id: number) {
    const pesquisaDeletada = await this.prisma.pesquisa.delete({
      where: { id },
    });

    return pesquisaDeletada;
  }
}
