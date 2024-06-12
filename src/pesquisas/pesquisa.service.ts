import { Injectable } from '@nestjs/common';

@Injectable()
export class PesquisaService {
  create() {
    return 'Criar';
  }

  findAll() {
    return 'Encontrar todos';
  }

  getById() {
    return 'Encontrar pelo id';
  }

  update() {
    return 'Atualizar';
  }

  delete() {
    return 'Deletar';
  }
}
