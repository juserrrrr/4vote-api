import { Module } from '@nestjs/common';
import { PesquisaController } from './pesquisa.controller';
import { PesquisaService } from './pesquisa.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailerModule } from '../mailer/mailer.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [PrismaModule, MailerModule, UsuariosModule],
  controllers: [PesquisaController],
  providers: [PesquisaService],
  exports: [],
})
export class PesquisaModule {}
