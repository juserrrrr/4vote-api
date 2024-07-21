import { Module } from '@nestjs/common';
import { ParcipacoesController } from './participacoes.controller';
import { ParticipacaoService } from './participacao.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParcipacoesController],
  providers: [ParticipacaoService],
  exports: [],
})
export class ParticipacoesModule {}
