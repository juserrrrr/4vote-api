import { IsNotEmpty, IsEmail, IsString, IsBoolean } from 'class-validator';
import { CreateUsuarioDto } from '../../usuarios/dto/create-usuario.dto';

export class AuthCadastroDto extends CreateUsuarioDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  senha: string;

  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsBoolean()
  validado: boolean = false;
}
