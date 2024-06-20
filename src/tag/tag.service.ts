import { Injectable } from '@nestjs/common';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  findAll(): string {
    return `Aqui retorna todas as Tags`;
  }

  findOne(id: number): string {
    return `Aqui retorna a Tag com o id ${id.toString}`;
  }

  update(id: number, updateTagDto: UpdateTagDto): string {
    return `Aqui retorna a tag alterada com o id ${id.toString()} para as novas informações do objeto com o id ${updateTagDto.id.toString}`;
  }

  remove(id: number): string {
    return `Tag do id ${id.toString} deletada com sucesso`;
  }
}
