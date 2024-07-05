import { Injectable } from '@nestjs/common';

@Injectable()
export class VotoService {
  findOne(id: number): string {
    return `Aqui retorna o voto com o id ${id.toString}`;
  }
}
