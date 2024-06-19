import { Injectable } from '@nestjs/common';
import { CreateOpcaoVotadaDto } from './dto/create-opcaovotada.dto';
import { UpdateOpcaoVotadaDto } from './dto/update-opcaovotada.dto';

@Injectable()
export class OpcaoVotadaService {
  create(createOpcaoVotadaDto: CreateOpcaoVotadaDto): string {
    return `Tag criada com sucesso com o id ${createOpcaoVotadaDto.id_opcao.toString}`;
  }

  findAll(): string {
    return `Aqui retorna todas as opções votadas`;
  }

  findOne(id: number): string {
    return `Aqui retorna a opção votada com o id ${id.toString}`;
  }

  update(id: number, updateOpcaoVotadaDto: UpdateOpcaoVotadaDto): string {
    return `Aqui retorna opção votada alterada com o id ${id.toString()} para as novas informações do objeto com o id ${updateOpcaoVotadaDto.id_opcao.toString}`;
  }

  remove(id: number): string {
    return `Opção votada do id ${id.toString} deletada com sucesso`;
  }
}
