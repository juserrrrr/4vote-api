import { Address } from 'nodemailer/lib/mailer';

// Define o tipo para o DTO de envio de email
export type SendEmailDto = {
  from?: Address; // Remetente do email, opcional
  recipients: Address[]; // Lista de destinatários do email
  subject: string; // Assunto do email
  html: string; // Conteúdo HTML do email
  text?: string; // Conteúdo texto do email, opcional
  placeholderRaplecements?: Record<string, string>; // Substituições de placeholders no HTML, opcional
};
