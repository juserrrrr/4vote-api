import { Module } from '@nestjs/common';
import { ParcipacoesController } from './participacoes.controller';
import { ParticipacaoService } from './participacao.service';

@Module({
  controllers: [ParcipacoesController],
  providers: [ParticipacaoService],
})
export class ParticipacoesModule {}
