import { Controller, Get, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { OpcaoService } from './opcao.service';
import { UpdateOpcaoDto } from './dto/update-opcao.dto';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('opcoes')
export class OpcaoController {
  constructor(private readonly opcaoService: OpcaoService) {}

  @Get()
  findAll() {
    return this.opcaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.opcaoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateOpcaoDto: UpdateOpcaoDto) {
    return this.opcaoService.update(+id, updateOpcaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.opcaoService.remove(+id);
  }
}
