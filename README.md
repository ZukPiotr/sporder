# SPORDER

## Issue
- Jeden duży plik, przydałby się podział na mniejsze komponenty
- Dodanie konteneryzacji
- Skalowalność UI'a

## Instrukcja obsługi
- Frontend
  - ```npm install```
  - ```npm run dev```
- Backend
  - ```npx @nestjs/cli new backend```
    - menager -> npm
  -   
- Baza danych
- Docker
  - ```docker-compose up -d``` 


## Jakie funkcjonalności mają się tam znaleźć
- Komunikator
  - Prosta komunikacja pomiędzy użytkownikami
- System rezerwacji
  - System wymiany barterowej - Trening za terning
  - Płatne zajecia indywidualne/grupwe
  - Rezerwacja slotów na konkretne gierki/wydarzenia
- System grup i znajomych
  - Informowanie który znajomy bierze udział w jakim wydarzeniu
- System wydarzeń
- System zbierania punktów za udział 
- Nawigacja
  - Wyszukiwarka eventów/gierek/spotkań 
- Tagowanie
- FUNC#1

## Stack Technologiczny

- **FRONTEND** - React
- **BACKEND** - NestJS w Node.JS
- **WARSTWA API** - GraphQL
- **BAZA DANYCH** - PostgreSQL
- **UWIERZETYLNIANIE** - OAuth2.0 z JWT (JSON Web Token)
- **APLIKACJE MOBILNE** - React Native
- **KOMUNIKATOR** - Websockets + GraphQL Subscriptions

## Problemy architektoniczne
- Serwerowanie
- Definicja struktury baz danych
- React Native vs Flutter
