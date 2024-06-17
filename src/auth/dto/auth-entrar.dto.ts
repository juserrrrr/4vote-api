import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthEntrarDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  senha: string;
}
