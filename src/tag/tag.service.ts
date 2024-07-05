import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  findAll(): string {
    return `Aqui retorna todas as Tags`;
  }

  findOne(id: number): string {
    return `Aqui retorna a Tag com o id ${id.toString}`;
  }
}
