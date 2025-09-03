import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ZMIANA: Dodajemy obiekt konfiguracyjny do ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    // Usuwa wszystkie pola z obiektu DTO, które nie mają dekoratorów walidacji.
    // Zabezpiecza to przed niechcianymi danymi.
    whitelist: true,

    // !! KLUCZOWY ELEMENT !!
    // Automatycznie transformuje przychodzące dane (plain JSON) na instancje
    // naszych klas DTO. To pozwala na działanie @Type() i @ValidateNested.
    transform: true,

    // Umożliwia niejawną konwersję typów (np. string z URL na number w DTO)
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Włącza CORS, aby frontend mógł komunikować się z API
  app.enableCors();

  await app.listen(process.env.BACKEND_PORT || 3000);
}
bootstrap();