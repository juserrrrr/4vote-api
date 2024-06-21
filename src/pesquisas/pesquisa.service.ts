import { Injectable } from '@nestjs/common';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { UpdatePesquisaDto } from './dto/update-pesquisa.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PesquisaService {
  constructor(private readonly prisma: PrismaService) {}

  create(body: CreatePesquisaDto) {
    const retorno = Object.entries(body)
      .map(([chave, valor]) => `${chave}: ${valor}`)
      .join(', ');
    return `Pesquisa criada: ${retorno}`;
  }

  findAll() {
    return 'Retornando todas as pesquisas';
  }

  getById(id: number) {
    return `Pesquisa de id ${id} encontrada`;
  }

  update(body: UpdatePesquisaDto, id: number) {
    const retorno = Object.entries(body)
      .map(([chave, valor]) => `${chave}: ${valor}`)
      .join(', ');
    return `Dados atualizados para pesquisa de ID ${id}:\n ${retorno}`;
  }

  async updateArquivar(body: UpdatePesquisaDto, id: number) {
    const pesquisaArquivada = await this.prisma.pesquisa.update({
      where: { id },
      data: { arquivado: true },
    });
    return pesquisaArquivada;
  }

  delete(id: number) {
    return `Deletando pesquisa de ID ${id}`;
  }
}
