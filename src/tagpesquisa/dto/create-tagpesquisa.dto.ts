import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateTagPesquisaDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  pesquisa: string;
}
