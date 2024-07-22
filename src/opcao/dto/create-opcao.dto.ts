import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateOpcaoDto {
  @IsString({ message: 'O texto da opção deve ser uma string' })
  @IsNotEmpty({ message: 'O texto da opção é obrigatório' })
  @Length(3, 100, { message: 'O texto da opção deve ter entre 3 e 100 caracteres' })
  texto: string;

  @IsOptional()
  imagemOpcao?: any;
}
