import { Injectable } from '@nestjs/common';
import { UpdateOpcaoVotadaDto } from './dto/update-opcaovotada.dto';

@Injectable()
export class OpcaoVotadaService {
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
