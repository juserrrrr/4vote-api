import { Module } from '@nestjs/common';
import { VotoService } from './voto.service';
import { VotoController } from './voto.controller';

@Module({
  controllers: [VotoController],
  providers: [VotoService],
})
export class VotoModule {}
