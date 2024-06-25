import { Controller, Get, Param } from '@nestjs/common';
import { VotoService } from './voto.service';

@Controller('voto')
export class VotoController {
  constructor(private readonly votoService: VotoService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.votoService.findOne(+id);
  }
}
