import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTagPesquisaDto {
  @IsNumber()
  @IsNotEmpty()
  tag_id: number;

  @IsNumber()
  @IsNotEmpty()
  pesquisa_id: number;
}
