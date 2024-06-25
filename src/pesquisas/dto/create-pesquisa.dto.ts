import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { CreatePerguntaDto } from 'src/perguntas/dto/create-pergunta.dto';
import { CreateTagDto } from 'src/tag/dto/create-tag.dto';
import { CreateTagPesquisaDto } from 'src/tagpesquisa/dto/create-tagpesquisa.dto';

export class CreatePesquisaDto {
  @IsString()
  titulo: string;

  @IsString()
  codigo: string;

  @IsDate()
  dataCriacao: Date;

  @IsDate()
  dataTermino: Date;

  @IsBoolean()
  ehPublico: boolean;

  @IsString()
  descricao: string;

  @IsNumber()
  criador: number;

  @IsBoolean()
  arquivado: boolean;

  @IsString()
  URLimagem: string;

  @IsBoolean()
  ehVotacao: boolean;

  perguntas: CreatePerguntaDto[];

  tags: CreateTagDto[];

  tagsPesquisa: CreateTagPesquisaDto[];
}
