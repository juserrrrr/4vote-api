import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PesquisaModule } from './pesquisas/pesquisa.module';

@Module({
  imports: [UsuariosModule, PesquisaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
