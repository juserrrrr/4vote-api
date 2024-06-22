import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';
import { UpdateParticipacaoDto } from './dto/update-participacao.dto';
import { ParticipacaoService } from './participacao.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('participacoes')
export class ParcipacoesController {
  constructor(private readonly participacaoService: ParticipacaoService) {}

  @Get()
  async getAll() {
    return this.participacaoService.getAll();
  }

  @Get(':id')
  getById(@Param('id', new ParseIntPipe()) id: number) {
    return this.participacaoService.getById(id);
  }

  @Post()
  create(@Body() createParticipacaoDto: CreateParticipacaoDto) {
    return this.participacaoService.create(createParticipacaoDto);
  }

  @Put(':id')
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateParticipacaoDto: UpdateParticipacaoDto) {
    return this.participacaoService.update(id, updateParticipacaoDto);
  }

  @Delete(':id')
  delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.participacaoService.delete(id);
  }
}
