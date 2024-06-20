import { Controller, Get, Body, Param, Put, Delete } from '@nestjs/common';
import { OpcaoVotadaService } from './opcaovotada.service';
import { UpdateOpcaoVotadaDto } from './dto/update-opcaovotada.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('opcaovotada')
export class OpcaoVotadaController {
  constructor(private readonly opcaoVotadaService: OpcaoVotadaService) {}

  @Get()
  findAll() {
    return this.opcaoVotadaService.findAll();
  }

  @Get(':id_opcao')
  findOne(@Param('id_opcao') id: number) {
    return this.opcaoVotadaService.findOne(+id);
  }

  @Put(':id_opcao')
  update(@Param('id_opcao') id: string, @Body(new ValidationPipe()) updateOpcaoVotadaDto: UpdateOpcaoVotadaDto) {
    return this.opcaoVotadaService.update(+id, updateOpcaoVotadaDto);
  }

  @Delete(':id_opcao')
  remove(@Param('id_opcao') id: string) {
    return this.opcaoVotadaService.remove(+id);
  }
}
