import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePerguntaDto {
  @IsString()
  texto: string;

  @IsOptional()
  @IsString()
  URLimagem?: string;

  @IsInt()
  pesquisa_id: number;
}
