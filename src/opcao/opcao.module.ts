import { Module } from '@nestjs/common';
import { OpcaoService } from './opcao.service';
import { OpcaoController } from './opcao.controller';

@Module({
  controllers: [OpcaoController],
  providers: [OpcaoService],
})
export class OpcaoModule {}
