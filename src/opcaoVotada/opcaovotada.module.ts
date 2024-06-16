import { Module } from '@nestjs/common';
import { OpcaoVotadaService } from './opcaovotada.service';
import { OpcaoVotadaController } from './opcaovotada.controller';

@Module({
  controllers: [OpcaoVotadaController],
  providers: [OpcaoVotadaService],
})
export class OpcaoVotadaModule {}
