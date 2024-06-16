import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TagPesquisaService } from './tagpesquisa.service';
import { CreateTagPesquisaDto } from './dto/create-tagpesquisa.dto';
import { UpdateTagPesquisaDto } from './dto/update-tagpesquisa.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('tagpesquisa')
export class TagPesquisaController {
  constructor(private readonly tagPesquisaService: TagPesquisaService) {}

  @Post()
  create(@Body(new ValidationPipe()) createTagPesquisaDto: CreateTagPesquisaDto) {
    return this.tagPesquisaService.create(createTagPesquisaDto);
  }

  @Get()
  findAll() {
    return this.tagPesquisaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tagPesquisaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateTagPesquisaDto: UpdateTagPesquisaDto) {
    return this.tagPesquisaService.update(+id, updateTagPesquisaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagPesquisaService.remove(+id);
  }
}
