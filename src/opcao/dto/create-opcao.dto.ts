import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateOpcaoDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  texto: string;
}
