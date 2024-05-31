import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!<br>Fernanda<br>Gabriel Baptista<br>Brenda Trindade<br>Pedro Mendes<br>Amanda<br>Ilson Neto';
  }
}
