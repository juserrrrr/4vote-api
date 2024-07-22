import { Controller, Get, Body, Patch, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDTO } from '../modules/upload/upload.dto';

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
  @UseInterceptors(FileInterceptor('file'))
  update(@Req() req: any, @UploadedFile() file: FileDTO, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    const userId = req.user.sub;
    return this.usuariosService.update(userId, updateUsuarioDto, file);
  }
}
