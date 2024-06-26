import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://4vote-api.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  await app.listen(4000);
}
bootstrap();
