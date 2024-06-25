import { Injectable } from '@nestjs/common';

@Injectable()
export class OpcaoService {
  findOne(id: number): string {
    return `Aqui retorna a opção com o id ${id.toString}`;
  }
}
