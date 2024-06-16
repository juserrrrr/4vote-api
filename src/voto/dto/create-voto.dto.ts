import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateVotoDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  data: string;

  @IsString()
  @IsNotEmpty()
  hash: string;
}
