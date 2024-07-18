import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCadastroDto } from './dto/auth-cadastro.dto';
import { AuthEntrarDto } from './dto/auth-entrar.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('entrar')
  async entrar(@Body() entrarDto: AuthEntrarDto) {
    return this.authService.entrar(entrarDto);
  }

  @Post('cadastro')
  async cadastro(@Body() cadastroDto: AuthCadastroDto) {
    return this.authService.cadastro(cadastroDto);
  }

  @Post('recuperar-senha')
  async recuperarSenha(@Body('email') email: string) {
    return this.authService.recuperarSenha(email);
  }
}
