import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './mail.interface';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  // Rota para enviar email
  @Post('/send-email')
  async sendEmail(@Body() body: any) {
    // Cria o DTO a partir do corpo da requisição
    const dto: SendEmailDto = {
      from: body.from, // Remetente do email
      recipients: [{ name: body.recipientName, address: body.recipientEmail }], // Destinatário(s) do email
      subject: body.subject, // Assunto do email
      html: body.html, // Conteúdo HTML do email
      text: body.text, // Conteúdo texto do email (opcional)
      placeholderRaplecements: body.placeholderReplacements, // Substituições de placeholders (opcional)
    };

    // Chama o serviço para enviar o email e retorna o resultado
    return await this.mailerService.sendEmail(dto);
  }
}
