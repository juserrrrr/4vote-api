import { Module } from '@nestjs/common';
import { PesquisaController } from './pesquisa.controller';
import { PesquisaService } from './pesquisa.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailerModule } from '../mailer/mailer.module';
import { UsuariosService } from '../usuarios/usuarios.service';

@Module({
  imports: [PrismaModule, MailerModule, UsuariosService],
  controllers: [PesquisaController],
  providers: [PesquisaService],
  exports: [],
})
export class PesquisaModule {}
