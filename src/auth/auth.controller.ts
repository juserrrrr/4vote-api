import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthCadastroDto } from './dto/auth-cadastro.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: AuthLoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('cadastro')
  async cadastro(@Body() cadastroDto: AuthCadastroDto) {
    return this.authService.cadastro(cadastroDto);
  }
}
