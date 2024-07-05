import { Controller, Get, Param } from '@nestjs/common';
import { TagPesquisaService } from './tagpesquisa.service';

@Controller('tagpesquisa')
export class TagPesquisaController {
  constructor(private readonly tagPesquisaService: TagPesquisaService) {}

  @Get(':pesquisa_id')
  findByPesquisa(@Param('pesquisa_id') pesquisa_id: number) {
    return this.tagPesquisaService.findByPesquisa(pesquisa_id);
  }
}
