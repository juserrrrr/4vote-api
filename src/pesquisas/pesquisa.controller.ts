import { Controller, Get, Post, Delete, Patch } from '@nestjs/common';
import { PesquisaService } from './pesquisa.service';

@Controller('pesquisas')
export class PesquisaControle {
  constructor(private readonly pesquisaService: PesquisaService) {}

  @Post()
  create() {
    return this.pesquisaService.create();
  }

  @Get()
  findAll() {
    return 'Pesquisas';
  }

  @Patch()
  update() {
    return 'Atualizar';
  }

  @Delete()
  remove() {
    return 'Remover';
  }
}
