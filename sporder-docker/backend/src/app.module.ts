import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { BookingsModule } from './bookings/bookings.module';
import { ProfilesModule } from './profiles/profiles.module';
import { FriendshipsModule } from './friendships/friendships.module';

@Module({
  imports: [
    // 1. Moduł konfiguracji, który wczyta zmienne z pliku .env
    ConfigModule.forRoot({
      isGlobal: true, // Udostępnia ConfigService w całej aplikacji
    }),
    // 2. Konfiguracja połączenia z bazą danych
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT'), 10),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Automatycznie wczytuj wszystkie encje
        synchronize: true, // UWAGA: Na produkcji powinno być false! Automatycznie tworzy tabele.
      }),
    }),
    // 3. Dodane moduły aplikacji
    AuthModule,
    UsersModule,
    EventsModule,
    BookingsModule,
    ProfilesModule,
    FriendshipsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
