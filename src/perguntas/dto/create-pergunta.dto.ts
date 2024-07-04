import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { CreateOpcaoDto } from '../../opcao/dto/create-opcao.dto';

export class CreatePerguntaDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  texto: string;

  @IsOptional()
  @IsString()
  URLimagem?: string;

  @IsArray()
  @ArrayMinSize(2)
  opcoes: CreateOpcaoDto[];
}
