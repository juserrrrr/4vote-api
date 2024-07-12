import { Controller, Get, Body, Patch, UseGuards, Headers, Query } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  findMe(@Headers() headers) {
    return this.usuariosService.findMe(headers);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  update(@Headers() headers, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(headers, updateUsuarioDto);
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    const user = await this.usuariosService.findByEmail(email);
    return user ? user : null;
  }
}
