import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Req, UseGuards, Query } from '@nestjs/common';
import { PesquisaService } from './pesquisa.service';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { AuthGuard } from '../auth/auth.guard';
import { filterPesquisaDto } from './dto/filter-pesquisa.dto';

@UseGuards(AuthGuard)
@Controller('pesquisas')
export class PesquisaController {
  constructor(private readonly pesquisaService: PesquisaService) {}

  @Post()
  create(
    @Body()
    createPesquisaDto: CreatePesquisaDto,
    @Req() req: any,
  ) {
    const idUser = req.user.sub;
    return this.pesquisaService.create(createPesquisaDto, idUser);
  }

  @Get('codigos')
  findAllCodes() {
    return this.pesquisaService.findAllCodes();
  }

  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.pesquisaService.findByCode(code);
  }

  @Get('filtro')
  filter(@Query() query: filterPesquisaDto, @Req() req: any) {
    const idUser = req.user.sub;
    return this.pesquisaService.filterSurveys(query, idUser);
  }

  @Patch('arquivar/:id')
  updateArquivar(@Param('id', new ParseIntPipe()) idSurvey: number, @Req() req: any) {
    const idUser = Number(req.user.sub);
    return this.pesquisaService.updateArquivar(idSurvey, idUser);
  }
}
