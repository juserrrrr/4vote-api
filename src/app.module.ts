import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VotoModule } from './voto/voto.module';

@Module({
  imports: [VotoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
