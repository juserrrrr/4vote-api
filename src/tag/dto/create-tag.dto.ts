import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNumber()
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  nome: string;
}
