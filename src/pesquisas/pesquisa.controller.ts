import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { PesquisaService } from './pesquisa.service';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
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

  @Patch('arquivar/:id')
  updateArquivar(@Param('id', new ParseIntPipe()) id: number) {
    return this.pesquisaService.updateArquivar(id);
  }
}
