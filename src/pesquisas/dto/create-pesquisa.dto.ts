import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

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
}
