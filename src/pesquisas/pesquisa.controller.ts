import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('pesquisas')
export class PesquisaControle {
  //constructor(private readonly )

  @Post()
  create(@Body() body) {
    return { body };
  }

  @Get()
  findAll() {
    return 'Pesquisas';
  }
}
