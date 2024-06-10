import { Module } from '@nestjs/common';
import { PerguntasService } from './perguntas.service';
import { PerguntasController } from './perguntas.controller';

@Module({
  controllers: [PerguntasController],
  providers: [PerguntasService],
})
export class PerguntasModule {}
