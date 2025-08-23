FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

#Uruchomienie produkcyjne
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=development /usr/src/app/dist ./dist

# Domyślnie NestJS słucha na porcie 3000
EXPOSE 3000

CMD ["node", "dist/main"]