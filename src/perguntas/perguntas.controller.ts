import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PerguntasService } from './perguntas.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('perguntas')
export class PerguntasController {
  constructor(private readonly perguntasService: PerguntasService) {}

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.perguntasService.findOne(id);
  }
}
