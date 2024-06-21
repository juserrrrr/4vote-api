import { Module } from '@nestjs/common';
import { PesquisaController } from './pesquisa.controller';
import { PesquisaService } from './pesquisa.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [PesquisaController],
  providers: [PesquisaService],
  exports: [],
})
export class PesquisaModule {}
