import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';
import { UpdateParticipacaoDto } from './dto/update-participacao.dto';
import { ParticipacaoService } from './shared/participacao.service/participacao.service';

@Controller('participacoes')
export class ParcipacoesController {
  constructor(private readonly participacaoService: ParticipacaoService) {}

  @Get()
  async getAll() {
    return this.participacaoService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.participacaoService.getById(Number(id));
  }

  @Post()
  create(@Body() createParticipacaoDto: CreateParticipacaoDto) {
    return this.participacaoService.create(createParticipacaoDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateParticipacaoDto: UpdateParticipacaoDto) {
    return this.participacaoService.update(Number(id), updateParticipacaoDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.participacaoService.delete(Number(id));
  }
}
