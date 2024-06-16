import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VotoModule } from './voto/voto.module';
import { TagPesquisaModule } from './tagpesquisa/tagpesquisa.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [UsuariosModule, VotoModule, TagPesquisaModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
