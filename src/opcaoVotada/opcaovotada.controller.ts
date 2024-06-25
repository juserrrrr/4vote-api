import { Controller, Get, Param } from '@nestjs/common';
import { OpcaoVotadaService } from './opcaovotada.service';

@Controller('opcaovotada')
export class OpcaoVotadaController {
  constructor(private readonly opcaoVotadaService: OpcaoVotadaService) {}

  @Get(':opcao_id')
  findByOpcao(@Param('opcao_id') opcao_id: number) {
    return this.opcaoVotadaService.findByOpcao(opcao_id);
  }
}
