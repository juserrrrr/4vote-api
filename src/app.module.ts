import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VotoModule } from './voto/voto.module';

@Module({
  imports: [UsuariosModule, VotoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
