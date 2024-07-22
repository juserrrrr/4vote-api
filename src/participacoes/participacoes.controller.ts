import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ParticipacaoService } from './participacao.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';

@UseGuards(AuthGuard)
@Controller('participacoes')
export class ParcipacoesController {
  constructor(private readonly participacaoService: ParticipacaoService) {}

  @Post(':idSurvey')
  create(
    @Req() req: any,
    @Param('idSurvey', new ParseIntPipe()) idSurvey: number,
    @Body()
    createParticipaoDto: CreateParticipacaoDto,
  ) {
    const idUser: number = Number(req.user.sub);
    return this.participacaoService.create(createParticipaoDto, idUser, idSurvey);
  }

  @Get('validar/:hashVote')
  validateVote(@Param('hashVote') hashVote: string) {
    return this.participacaoService.validateVote(hashVote);
  }

  @Get(':id')
  getById(@Param('id', new ParseIntPipe()) id: number) {
    return this.participacaoService.getById(id);
  }
}
