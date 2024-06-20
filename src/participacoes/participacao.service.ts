import { Injectable } from '@nestjs/common';
import { UpdateParticipacaoDto } from './dto/update-participacao.dto';

@Injectable()
export class ParticipacaoService {
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
