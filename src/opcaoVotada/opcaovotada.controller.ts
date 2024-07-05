import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OpcaoVotadaService } from './opcaovotada.service';

@Controller('opcaoVotada')
export class OpcaoVotadaController {
  constructor(private readonly opcaoVotadaService: OpcaoVotadaService) {}

  @Get(':idVoto')
  findByVote(@Param('idVoto', new ParseIntPipe()) idVote: number) {
    return this.opcaoVotadaService.findByVote(idVote);
  }
}
