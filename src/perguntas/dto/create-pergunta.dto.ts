import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { CreateOpcaoDto } from '../../opcao/dto/create-opcao.dto';
import { Type } from 'class-transformer';

export class CreatePerguntaDto {
  @IsString({ message: 'O texto da pergunta deve ser uma string' })
  @IsNotEmpty({ message: 'O texto da pergunta é obrigatório' })
  @Length(5, 100, { message: 'O texto da pergunta deve ter entre 5 e 100 caracteres' })
  texto: string;

  @IsOptional()
  @IsString({ message: 'A URL da imagem deve ser uma string' })
  URLimagem?: string;

  @IsArray({ message: 'As opções devem ser um array de objetos' })
  @ArrayMinSize(2, { message: 'A pergunta deve ter no mínimo 2 opções' })
  @ValidateNested({ each: true, message: 'Cada opção deve ser válida' })
  @Type(() => CreateOpcaoDto)
  opcoes: CreateOpcaoDto[];
}
