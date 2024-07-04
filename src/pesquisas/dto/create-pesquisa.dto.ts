import { CreatePerguntaDto } from 'src/perguntas/dto/create-pergunta.dto';
import { IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { CreateOpcaoDto } from '../../opcao/dto/create-opcao.dto';

export class CreatePesquisaDto {
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsString()
  descricao?: string;

  @IsNotEmpty()
  @IsDateString()
  dataTermino: string;

  @IsNotEmpty()
  @IsBoolean()
  ehPublico: boolean;

  @IsString()
  URLimagem?: string;

  @IsNotEmpty()
  @IsBoolean()
  ehVotacao: boolean;

  perguntas: CreatePerguntaDto[];

  opcoes?: CreateOpcaoDto[];
}
