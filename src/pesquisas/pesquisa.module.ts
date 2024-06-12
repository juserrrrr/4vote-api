import { Module } from '@nestjs/common';
import { PesquisaControle } from './pesquisa.controller';
import { PesquisaService } from './pesquisa.service';

@Module({
  imports: [],
  controllers: [PesquisaControle],
  providers: [PesquisaService],
  exports: [],
})
export class PesquisaModule {}
