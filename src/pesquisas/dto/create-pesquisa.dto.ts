import { CreatePerguntaDto } from 'src/perguntas/dto/create-pergunta.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreatePesquisaDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
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
  @IsOptional()
  @IsUrl()
  URLimagem?: string;

  @IsNotEmpty()
  @IsBoolean()
  ehVotacao: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateIf((obj) => obj.ehVotacao === true)
  @ArrayMaxSize(1)
  perguntas: CreatePerguntaDto[];
}
