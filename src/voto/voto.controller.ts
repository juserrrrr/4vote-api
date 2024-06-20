import { Controller, Get, Body, Param, Put, Delete } from '@nestjs/common';
import { VotoService } from './voto.service';
import { UpdateVotoDto } from './dto/update-voto.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('voto')
export class VotoController {
  constructor(private readonly votoService: VotoService) {}

  @Get()
  findAll() {
    return this.votoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.votoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateVotoDto: UpdateVotoDto) {
    return this.votoService.update(+id, updateVotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.votoService.remove(+id);
  }
}
