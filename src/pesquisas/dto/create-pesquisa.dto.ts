import { CreatePerguntaDto } from 'src/perguntas/dto/create-pergunta.dto';
import { CreateTagDto } from 'src/tag/dto/create-tag.dto';
import { CreateTagPesquisaDto } from 'src/tagpesquisa/dto/create-tagpesquisa.dto';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePesquisaDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsDate()
  dataCriacao: Date;

  @IsNotEmpty()
  @IsDate()
  dataTermino: Date;

  @IsNotEmpty()
  @IsBoolean()
  ehPublico: boolean;

  @IsString()
  descricao: string;

  @IsNotEmpty()
  @IsNumber()
  criador: number;

  @IsNotEmpty()
  @IsBoolean()
  arquivado: boolean;

  @IsString()
  URLimagem: string;

  @IsNotEmpty()
  @IsBoolean()
  ehVotacao: boolean;

  perguntas: CreatePerguntaDto[];

  tags: CreateTagDto[];

  tagsPesquisa: CreateTagPesquisaDto[];
}
