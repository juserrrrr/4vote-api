import { Injectable } from '@nestjs/common';
import { CreateVotoDto } from './dto/create-voto.dto';
import { UpdateVotoDto } from './dto/update-voto.dto';

export interface Voto {
  id: number;
  data: string;
  hash: string;
}

@Injectable()
export class VotoService {
  create(createVotoDto: CreateVotoDto): string {
    return `Voto criado com sucesso com o id ${createVotoDto.id.toString}`;
  }

  findAll(): string {
    return `Aqui retorna todos os votos`;
  }

  findOne(id: number): string {
    return `Aqui retorna o voto com o id ${id.toString}`;
  }

  update(id: number, updateVotoDto: UpdateVotoDto): string {
    return `Aqui retorna o voto alterado com o id ${id.toString()} para as novas informações do objeto com o id ${updateVotoDto.id.toString}`;
  }

  remove(id: number): string {
    return `Voto do id ${id.toString} deletado com sucesso`;
  }
}
