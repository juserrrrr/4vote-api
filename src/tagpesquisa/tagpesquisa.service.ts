import { Injectable } from '@nestjs/common';
import { UpdateTagPesquisaDto } from './dto/update-tagpesquisa.dto';

@Injectable()
export class TagPesquisaService {
  findAll(): string {
    return `Aqui retorna todas as Tags de pesquisa`;
  }

  findOne(id: number): string {
    return `Aqui retorna a Tag de pesquisa com o id ${id.toString}`;
  }

  update(id: number, updateTagPesquisaDto: UpdateTagPesquisaDto): string {
    return `Aqui retorna a tag de pesquisa alterada com o id ${id.toString()} para as novas informações do objeto com o id ${updateTagPesquisaDto.id.toString}`;
  }

  remove(id: number): string {
    return `Tag de pesquisa do id ${id.toString} deletada com sucesso`;
  }
}
