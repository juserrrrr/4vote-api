import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOpcaoDto } from './dto/create-opcao.dto';

export interface Opcao {
  id: number;
  texto: string;
  quantVotos: number;
}

@Injectable()
export class OpcaoService {
  private opcoes: Opcao[] = [];
  private idCounter = 1;

  create(createOpcaoDto: CreateOpcaoDto): Opcao {
    const newOpcao = { id: this.idCounter++, ...createOpcaoDto };
    this.opcoes.push(newOpcao);
    return newOpcao;
  }

  findAll(): Opcao[] {
    return this.opcoes;
  }

  findOne(id: number): Opcao {
    const opcao = this.opcoes.find((opcao) => opcao.id === id);
    if (!opcao) {
      throw new NotFoundException('Opção não encontrada.');
    }
    return opcao;
  }

  update(id: number, updateOpcaoDto: Partial<CreateOpcaoDto>): Opcao {
    const opcao = this.findOne(id);
    Object.assign(opcao, updateOpcaoDto);
    return opcao;
  }

  remove(id: number): void {
    const index = this.opcoes.findIndex((opcao) => opcao.id === id);
    if (index === -1) {
      throw new NotFoundException('Opção não encontrada.');
    }
    this.opcoes.splice(index, 1);
  }
}
