import { Controller, Get, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('me')
  findMe(@Req() req) {
    return this.usuariosService.findMe(req.usuario.id);
  }

  @Patch('me')
  update(@Req() req, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(req.usuario.id, updateUsuarioDto);
  }
}
