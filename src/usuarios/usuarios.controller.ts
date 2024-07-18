import { Controller, Get, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('me')
  findMe(@Req() req: any) {
    const userId = req.user.sub;
    return this.usuariosService.findMe(userId);
  }

  @Patch('me')
  update(@Req() req: any, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    const userId = req.user.sub;
    return this.usuariosService.update(userId, updateUsuarioDto);
  }
}
