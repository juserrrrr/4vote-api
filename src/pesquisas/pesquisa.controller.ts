import { Controller, Get, Post, Delete, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PesquisaService } from './pesquisa.service';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { UpdatePesquisaDto } from './dto/update-pesquisa.dto';
import { CreatePerguntaDto } from '../perguntas/dto/create-pergunta.dto';
import { CreateOpcaoDto } from '../opcao/dto/create-opcao.dto';

@Controller('pesquisas')
export class PesquisaController {
  constructor(private readonly pesquisaService: PesquisaService) {}

  @Post()
  create(
    @Body()
    createPesquisaDto: CreatePesquisaDto,
    createPerguntaDto: CreatePerguntaDto,
    createOpcaoDto: CreateOpcaoDto,
  ) {
    return this.pesquisaService.create(createPesquisaDto, createPerguntaDto, createOpcaoDto);
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

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.pesquisaService.delete(id);
  }
}
