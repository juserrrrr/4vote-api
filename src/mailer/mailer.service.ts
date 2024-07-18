import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './mail.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  // Método para criar e configurar o transporte de email usando Nodemailer
  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: true, // Usar `true` para porta 465, `false` para todas as outras portas
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
    return transporter;
  }

  // Método para substituir placeholders no HTML do email por valores específicos
  template(html: string, replacements: Record<string, string>) {
    return html.replace(/%(.*?)%/g, (m, key) => {
      return replacements.hasOwnProperty(key) ? replacements[key] : '';
    });
  }

  // Método para carregar o template HTML do email
  loadTemplate(templateName: string): string {
    const filePath = path.join(__dirname, '..', '..', 'templates', `${templateName}.html`);
    return fs.readFileSync(filePath, 'utf-8');
  }

  // Método para enviar o email usando Nodemailer
  async sendEmail(dto: SendEmailDto) {
    const { from, recipients, subject, text } = dto;

    // Se houver placeholders a serem substituídos, chama o método template
    const html = dto.placeholderRaplecements ? this.template(dto.html, dto.placeholderRaplecements) : dto.html;
    const transport = this.mailTransport();

    // Opções do email, incluindo remetente, destinatários, assunto e conteúdo HTML
    const options: nodemailer.SendMailOptions = {
      from: from ?? {
        name: this.configService.get<string>('APP_NAME'),
        address: this.configService.get<string>('DEFAULT_EMAIL_FROM'),
      },
      to: recipients,
      subject,
      html,
      text,
    };

    try {
      // Envia o email e retorna o resultado
      const result = await transport.sendMail(options);
      return result;
    } catch (error) {
      // Em caso de erro, exibe o erro no console
      console.log('Error: ', error);
    }
  }
}
