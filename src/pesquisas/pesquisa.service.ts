import { Injectable } from '@nestjs/common';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { UpdatePesquisaDto } from './dto/update-pesquisa.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PesquisaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreatePesquisaDto) {
    return await this.prisma.$executeRaw`
    INSERT INTO Pesquisa (
      titulo,
      codigo,
      dataCriacao,
      dataTermino,
      ehPublico,
      descricao,
      criador,
      arquivado,
      URLimagem,
      ehVotacao
      ) VALUES ( 
      ${body.titulo}, 
      ${body.codigo}, 
      ${body.dataCriacao}, 
      ${body.dataTermino}, 
      ${body.ehPublico}, 
      ${body.descricao}, 
      ${body.criador}, 
      ${body.arquivado}, 
      ${body.URLimagem}, 
      ${body.ehVotacao})`;
  }

  async findAll() {
    return await this.prisma.$queryRaw`
    SELECT * FROM Pesquisa`;
  }

  async getById(id: number) {
    return await this.prisma.$queryRaw`
    SELECT * FROM Pesquisa WHERE id = ${id}`;
  }

  async update(body: UpdatePesquisaDto, id: number) {
    return await this.prisma.$queryRaw`
    UPDATE Pesquisa SET 
    titulo = ${body.titulo}, 
    codigo = ${body.codigo}, 
    dataCriacao = ${body.dataCriacao}, 
    dataTermino = ${body.dataTermino}, 
    ehPublico =  ${body.ehPublico}, 
    descricao = ${body.descricao}, 
    criador = ${body.criador}, 
    arquivado = ${body.arquivado}, 
    URLimagem = ${body.URLimagem}, 
    ehVotacao = ${body.ehVotacao} 
    WHERE id = ${id}`;
  }

  async delete(id: number) {
    return await this.prisma.$executeRaw`
    DELETE FROM Pesquisa WHERE id = ${id}`;
  }
}
