import { Module } from '@nestjs/common';
import { ParcipacoesController } from './participacoes.controller';
import { ParticipacaoService } from './participacao.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [PrismaModule, UsuariosModule, MailerModule],
  controllers: [ParcipacoesController],
  providers: [ParticipacaoService],
  exports: [],
})
export class ParticipacoesModule {}
