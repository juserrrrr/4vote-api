import { Controller, Get, Post, Delete, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PesquisaService } from './pesquisa.service';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { UpdatePesquisaDto } from './dto/update-pesquisa.dto';

@Controller('pesquisas')
export class PesquisaController {
  constructor(private readonly pesquisaService: PesquisaService) {}

  @Post()
  create(@Body() body: CreatePesquisaDto) {
    return this.pesquisaService.create(body);
  }

  @Get()
  findAll() {
    return this.pesquisaService.findAll();
  }

  @Get(':id')
  getById(@Param('id', new ParseIntPipe()) id: number) {
    return this.pesquisaService.getById(id);
  }

  @Patch(':id')
  update(@Body() body: UpdatePesquisaDto, @Param('id') id) {
    return this.pesquisaService.update(body, id);
  }

  @Patch('arquivar/:id')
  updateArquivar(@Body() body: UpdatePesquisaDto, @Param('id') id) {
    return this.pesquisaService.updateArquivar(body, id);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.pesquisaService.delete(id);
  }
}
