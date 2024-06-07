import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParticipacoesModule } from './participacoes/participacoes.module';

@Module({
  imports: [ParticipacoesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
