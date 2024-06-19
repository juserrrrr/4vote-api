import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  nome: string;
}
