import { Injectable } from '@nestjs/common';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';
import { UpdateParticipacaoDto } from './dto/update-participacao.dto';

@Injectable()
export class ParticipacaoService {
  create(createParticipacaoDto: CreateParticipacaoDto): string {
    return `Participação criada com sucesso com o id ${createParticipacaoDto.id.toString}`;
  }

  getAll(): string {
    return 'Retornando todas as participações';
  }

  getById(id: number): string {
    return `Retornando participação para o usuário com o ID ${id.toString()}`;
  }

  update(id: number, updateParticipacaoDto: UpdateParticipacaoDto): string {
    return `parrticipação alterada com sucesso do id ${updateParticipacaoDto.usuario_id.toString()}`;
  }

  delete(id: number): string {
    return `Participação deletada com sucesso do ID ${id.toString()}`;
  }
}
