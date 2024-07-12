import { Controller, Get, Param } from '@nestjs/common';
import { VotoService } from './voto.service';

@Controller('voto')
export class VotoController {
  constructor(private readonly votoService: VotoService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.votoService.findOne(id);
  }
}
