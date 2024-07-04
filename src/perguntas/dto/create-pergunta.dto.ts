import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePerguntaDto {
  @IsString()
  @IsNotEmpty()
  texto: string;

  @IsOptional()
  @IsString()
  URLimagem?: string;
}
