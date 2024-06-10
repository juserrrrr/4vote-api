import { Module } from '@nestjs/common';
import { PesquisaControle } from './pesquisa.controller';

@Module({
  imports: [],
  controllers: [PesquisaControle],
  providers: [],
  exports: [],
})
export class PesquisaModule {}
