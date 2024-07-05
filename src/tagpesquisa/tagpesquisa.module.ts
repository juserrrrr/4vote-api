import { Module } from '@nestjs/common';
import { TagPesquisaService } from './tagpesquisa.service';
import { TagPesquisaController } from './tagpesquisa.controller';

@Module({
  controllers: [TagPesquisaController],
  providers: [TagPesquisaService],
})
export class TagPesquisaModule {}
