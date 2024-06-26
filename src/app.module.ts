import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PerguntasModule } from './perguntas/perguntas.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), UsuariosModule, PerguntasModule, MailerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
