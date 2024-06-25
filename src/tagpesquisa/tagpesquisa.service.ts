import { Injectable } from '@nestjs/common';

@Injectable()
export class TagPesquisaService {
  findByPesquisa(pesquisa_id: number) {
    return `Aqui retorna as Tags da pesquisa com o id ${pesquisa_id}`;
  }
}
