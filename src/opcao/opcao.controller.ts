import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OpcaoService } from './opcao.service';
import { CreateOpcaoDto } from './dto/create-opcao.dto';

@Controller('opcoes')
export class OpcaoController {
  constructor(private readonly opcaoService: OpcaoService) {}

  @Post()
  create(@Body() createOpcaoDto: CreateOpcaoDto) {
    return this.opcaoService.create(createOpcaoDto);
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
  update(@Param('id') id: string, @Body() updateOpcaoDto: Partial<CreateOpcaoDto>) {
    return this.opcaoService.update(+id, updateOpcaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.opcaoService.remove(+id);
  }
}
