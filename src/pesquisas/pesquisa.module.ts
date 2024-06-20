import { Module } from '@nestjs/common';
import { PesquisaController } from './pesquisa.controller';
import { PesquisaService } from './pesquisa.service';

@Module({
  imports: [],
  controllers: [PesquisaController],
  providers: [PesquisaService],
  exports: [],
})
export class PesquisaModule {}
