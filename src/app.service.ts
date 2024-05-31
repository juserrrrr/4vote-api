import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!<br>Fernanda';
    return 'Hello World!<br>Amanda';
  }
}
