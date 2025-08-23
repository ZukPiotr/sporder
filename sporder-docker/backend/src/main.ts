import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Włącza walidację dla wszystkich przychodzących zapytań
  app.useGlobalPipes(new ValidationPipe());

  // Włącza CORS, aby frontend mógł komunikować się z API
  app.enableCors();

  await app.listen(process.env.BACKEND_PORT || 3000);
}
bootstrap();