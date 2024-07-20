import { Controller, Get, Body, Patch, UseGuards, Req, Query } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  findMe(@Req() req: any) {
    const userId = req.user.sub;
    return this.usuariosService.findMe(userId);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  update(@Req() req: any, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    const userId = req.user.sub;
    return this.usuariosService.update(userId, updateUsuarioDto);
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    const user = await this.usuariosService.findByEmail(email);
    return user ? user : null;
  }
}
