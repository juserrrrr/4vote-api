import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PerguntasModule } from './perguntas/perguntas.module';

@Module({
  imports: [UsuariosModule, PerguntasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
