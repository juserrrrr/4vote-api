import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateParticipacaoDto } from 'src/participacoes/dto/create-participacao.dto';
import { UpdateParticipacaoDto } from 'src/participacoes/dto/update-participacao.dto';

export interface Participacao {
  id: number;
  usuario_id: number;
  pesquisa_id: number;
}

@Injectable()
export class ParticipacaoService {
  private participacoes: Participacao[] = [];
  private idCounterPart: number = 1;

  create(createParticipacaoDto: CreateParticipacaoDto): Participacao {
    const newParticipacao: Participacao = {
      id: this.idCounterPart++,
      ...createParticipacaoDto,
    };
    this.participacoes.push(newParticipacao);
    return newParticipacao;
  }

  getAll(): Participacao[] {
    return this.participacoes;
  }

  getById(id: number): Participacao {
    const participacao = this.participacoes.find((part) => part.id === id);
    if (!participacao) {
      throw new NotFoundException('Participação não encontrada');
    }
    return participacao;
  }

  update(id: number, updateParticipacaoDto: UpdateParticipacaoDto): Participacao {
    const participacao = this.getById(id);
    if (updateParticipacaoDto.usuario_id !== undefined) {
      participacao.usuario_id = updateParticipacaoDto.usuario_id;
    }
    if (updateParticipacaoDto.pesquisa_id !== undefined) {
      participacao.pesquisa_id = updateParticipacaoDto.pesquisa_id;
    }
    return participacao;
  }

  delete(id: number): void {
    const index = this.participacoes.findIndex((part) => part.id === id);
    if (index === -1) {
      throw new NotFoundException('Participação não encontrada');
    }
    this.participacoes.splice(index, 1);
  }
}
