import { Injectable } from '@nestjs/common';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';

@Injectable()
export class PesquisaService {
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

  arquivar(id: number) {
    return `Pesquisa de id ${id} arquivada`;
  }
}
