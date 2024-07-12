import { Module } from '@nestjs/common';
import { OpcaoService } from './opcao.service';
import { OpcaoController } from './opcao.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OpcaoController],
  providers: [OpcaoService],
})
export class OpcaoModule {}
