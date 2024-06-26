import { Controller, Get, Body, Patch, UseGuards, Headers } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('me')
  findMe(@Headers() headers) {
    return this.usuariosService.findMe(headers);
  }

  @Patch('me')
  update(@Headers() headers, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(headers, updateUsuarioDto);
  }
}
