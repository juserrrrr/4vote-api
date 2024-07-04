import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { PesquisaService } from './pesquisa.service';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { AuthGuard } from '../auth/auth.guard';

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

  @Get()
  findAll() {
    return this.pesquisaService.findAll();
  }

  @Get(':id')
  getById(@Param('id', new ParseIntPipe()) id: number) {
    return this.pesquisaService.getById(id);
  }

  @Patch('arquivar/:id')
  updateArquivar(@Param('id', new ParseIntPipe()) idSurvey: number, @Req() req: any) {
    const idUser = Number(req.user.sub);
    return this.pesquisaService.updateArquivar(idSurvey, idUser);
  }
}
