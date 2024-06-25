import { Injectable } from '@nestjs/common';

@Injectable()
export class OpcaoVotadaService {
  findByOpcao(opcao_id: number) {
    return `Aqui retorna os votos da opcao com id ${opcao_id}`;
  }
}
