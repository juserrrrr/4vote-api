import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Req, UseGuards, Query } from '@nestjs/common';
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
  @Patch('arquivar/:id')
  updateArquivar(@Param('id', new ParseIntPipe()) idSurvey: number, @Req() req: any) {
    const idUser = Number(req.user.sub);
    return this.pesquisaService.updateArquivar(idSurvey, idUser);
  }
}
