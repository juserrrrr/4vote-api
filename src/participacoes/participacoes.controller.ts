import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { UpdateParticipacaoDto } from './dto/update-participacao.dto';
import { ParticipacaoService } from './participacao.service';
import { AuthGuard } from 'src/auth/auth.guard';

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

  @Put(':id')
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateParticipacaoDto: UpdateParticipacaoDto) {
    return this.participacaoService.update(id, updateParticipacaoDto);
  }

  @Delete(':id')
  delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.participacaoService.delete(id);
  }
}
