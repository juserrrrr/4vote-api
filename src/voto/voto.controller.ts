import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { VotoService } from './voto.service';
import { CreateVotoDto } from './dto/create-voto.dto';
import { UpdateVotoDto } from './dto/update-voto.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('voto')
export class VotoController {
  constructor(private readonly opcaoService: VotoService) {}

  @Post()
  create(@Body(new ValidationPipe()) createVotoDto: CreateVotoDto) {
    return this.opcaoService.create(createVotoDto);
  }

  @Get()
  findAll() {
    return this.opcaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.opcaoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateVotoDto: UpdateVotoDto) {
    return this.opcaoService.update(+id, updateVotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.opcaoService.remove(+id);
  }
}
