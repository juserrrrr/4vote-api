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
}
