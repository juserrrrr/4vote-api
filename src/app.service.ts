import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!<br>Fernanda<br>Gabriel Baptista<br>Brenda Trindade<br>Pedro Mendes<br>Amanda<br>Luis Mario<br>Ilson Neto<br>Thiago Sena<br>Gabriel Henry<br>José Gabriel<br>Naylane Ribeiro<br>Antonio Vitor<br>Sara Souza';
  }
}
