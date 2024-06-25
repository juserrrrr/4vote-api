import { Injectable } from '@nestjs/common';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';

@Injectable()
export class ParticipacaoService {
  create(createParticipacaoDto: CreateParticipacaoDto): string {
    return `Participação criada com sucesso na pesquisa com o id ${createParticipacaoDto.pesquisa_id}`;
  }

  getById(id: number): string {
    return `Retornando participação com o id ${id.toString()}`;
  }
}
