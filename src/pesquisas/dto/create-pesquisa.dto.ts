import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ArrayMinSize,
  ValidateNested,
  ValidateIf,
  ArrayMaxSize,
} from 'class-validator';
import { CreatePerguntaDto } from '../../perguntas/dto/create-pergunta.dto';

export class CreatePesquisaDto {
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @IsString({ message: 'O título deve ser uma string.' })
  @Length(5, 100, { message: 'O título deve ter entre 5 e 100 caracteres.' })
  titulo: string;

  @IsString({ message: 'A descrição deve ser uma string.' })
  @IsOptional()
  descricao?: string;

  @IsNotEmpty({ message: 'A data de término é obrigatória.' })
  @IsDateString({}, { message: 'A data de término deve ser uma data válida.' })
  dataTermino: string;

  @IsNotEmpty({ message: 'É necessário definir se é público ou não.' })
  @IsBoolean({ message: 'EhPublico deve ser um valor booleano.' })
  ehPublico: boolean;

  @IsString({ message: 'A URL da imagem deve ser uma string.' })
  @IsOptional()
  @IsUrl({}, { message: 'A URL da imagem deve ser uma URL válida.' })
  URLimagem?: string;

  @IsNotEmpty({ message: 'É necessário definir se é uma votação ou não.' })
  @IsBoolean({ message: 'EhVotacao deve ser um valor booleano.' })
  ehVotacao: boolean;

  @IsArray({ message: 'Perguntas deve ser um array.' })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos uma pergunta.' })
  @ValidateNested({ each: true, message: 'Cada pergunta deve ser válida.' })
  @Type(() => CreatePerguntaDto)
  @ValidateIf((obj) => obj.ehVotacao === true, { message: 'Validação condicional falhou.' })
  @ArrayMaxSize(1, { message: 'Deve haver no máximo uma pergunta para votações.' })
  perguntas: CreatePerguntaDto[];
}
