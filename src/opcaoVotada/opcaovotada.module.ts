import { Module } from '@nestjs/common';
import { OpcaoVotadaService } from './opcaovotada.service';
import { OpcaoVotadaController } from './opcaovotada.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OpcaoVotadaController],
  providers: [OpcaoVotadaService],
  exports: [],
})
export class OpcaoVotadaModule {}
