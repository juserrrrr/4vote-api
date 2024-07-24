import { Controller, Get, Post, Body, Param, Patch, Req, UseGuards, Query } from '@nestjs/common';
import { PesquisaService } from './pesquisa.service';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { AuthGuard } from '../auth/auth.guard';
import { filterPesquisaDto } from './dto/filter-pesquisa.dto';

@Controller('pesquisas')
export class PesquisaController {
  constructor(private readonly pesquisaService: PesquisaService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body()
    createPesquisaDto: CreatePesquisaDto,
    @Req() req: any,
  ) {
    const idUser = req.user.sub;
    return this.pesquisaService.create(createPesquisaDto, idUser);
  }

  @UseGuards(AuthGuard)
  @Get('codigos')
  findAllCodes() {
    return this.pesquisaService.findAllCodes();
  }

  @UseGuards(AuthGuard)
  @Get('filtrar')
  filterSurvey(@Query() query: filterPesquisaDto, @Req() req: any) {
    const idUser = req.user.sub;

    return this.pesquisaService.filterSurveys(query, idUser); // Executa a função
  }
  @UseGuards(AuthGuard)
  @Get('procurar/:code')
  findCode(@Param('code') code: string) {
    return this.pesquisaService.findByCode(code);
  }

  @UseGuards(AuthGuard)
  @Get('resultados/:code')
  getResultados(@Param('code') code: string, @Req() req: any) {
    const idUser = Number(req.user.sub);

    return this.pesquisaService.getResultado(idUser, code);
  }

  @UseGuards(AuthGuard)
  @Patch('arquivar/:code')
  updateArquivar(@Param('code') codeSUrvey: string, @Req() req: any) {
    const idUser = Number(req.user.sub);
    return this.pesquisaService.updateArquivar(codeSUrvey, idUser);
  }

  @UseGuards(AuthGuard)
  @Get('auditar/:code')
  auditSurvey(@Param('code') code: string) {
    return this.pesquisaService.auditSurvey(code);
  }
}
