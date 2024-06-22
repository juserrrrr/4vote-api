import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VotoModule } from './voto/voto.module';
import { TagPesquisaModule } from './tagpesquisa/tagpesquisa.module';
import { TagModule } from './tag/tag.module';
import { PesquisaModule } from './pesquisas/pesquisa.module';
import { AuthModule } from './auth/auth.module';
import { OpcaoModule } from './opcao/opcao.module';
import { ParticipacoesModule } from './participacoes/participacoes.module';
import { PerguntasModule } from './perguntas/perguntas.module';
import { OpcaoVotadaModule } from './opcaoVotada/opcaovotada.module';

@Module({
  imports: [
    AuthModule,
    OpcaoModule,
    OpcaoVotadaModule,
    ParticipacoesModule,
    PerguntasModule,
    PesquisaModule,
    TagModule,
    TagPesquisaModule,
    UsuariosModule,
    VotoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
