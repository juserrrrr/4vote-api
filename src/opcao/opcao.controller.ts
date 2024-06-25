import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OpcaoService } from './opcao.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('opcoes')
export class OpcaoController {
  constructor(private readonly opcaoService: OpcaoService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.opcaoService.findOne(+id);
  }
}
