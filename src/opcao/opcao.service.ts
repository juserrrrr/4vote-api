import { Injectable } from '@nestjs/common';
import { CreateOpcaoDto } from './dto/create-opcao.dto';
import { UpdateOpcaoDto } from './dto/update-opcao.dto';

export interface Opcao {
  id: number;
  texto: string;
  quantVotos: number;
}

@Injectable()
export class OpcaoService {
  create(createOpcaoDto: CreateOpcaoDto): string {
    return `Opção criada com sucesso com o id ${createOpcaoDto.id.toString}`;
  }

  findAll(): string {
    return `Aqui retorna todas as opções`;
  }

  findOne(id: number): string {
    return `Aqui retorna a opção com o id ${id.toString}`;
  }

  update(id: number, updateOpcaoDto: UpdateOpcaoDto): string {
    return `Aqui retorna a opção alterada com sucesso do id ${id.toString()} para as novas informações do objeto com o id ${updateOpcaoDto.id.toString}`;
  }

  remove(id: number): string {
    return `Opcao do id ${id.toString} deletada com sucesso`;
  }
}
