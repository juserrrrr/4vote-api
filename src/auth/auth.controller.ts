import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCadastroDto } from './dto/auth-cadastro.dto';
import { AuthEntrarDto } from './dto/auth-entrar.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('entrar')
  async entrar(@Body() loginDto: AuthEntrarDto) {
    return this.authService.login(loginDto);
  }

  @Post('cadastro')
  async cadastro(@Body() registerDto: AuthCadastroDto) {
    return this.authService.register(registerDto);
  }

  @Post('recuperar-senha')
  async recuperarSenha(@Body('email') email: string) {
    return this.authService.recoverPassword(email);
  }

  @Post('validar-usuario/:codeVal')
  async validarUsuario(@Param() codeVal: string) {
    return this.authService.validadeUser(codeVal);
  }
}
