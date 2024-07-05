import { Module } from '@nestjs/common';
import { OpcaoVotadaService } from './opcaovotada.service';
import { OpcaoVotadaController } from './opcaovotada.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [PrismaClient],
  controllers: [OpcaoVotadaController],
  providers: [OpcaoVotadaService],
  exports: [],
})
export class OpcaoVotadaModule {}
