import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { VotoService } from './voto.service';
import { CreateVotoDto } from './dto/create-voto.dto';
import { UpdateVotoDto } from './dto/update-voto.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('voto')
export class VotoController {
  constructor(private readonly votoService: VotoService) {}

  @Post()
  create(@Body(new ValidationPipe()) createVotoDto: CreateVotoDto) {
    return this.votoService.create(createVotoDto);
  }

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
