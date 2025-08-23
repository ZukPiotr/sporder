FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# ETAP 2: Serwowanie aplikacji na Nginx
# Używamy oficjalnego, lekkiego obrazu Nginx
FROM nginx:stable-alpine as production

# Kopiujemy gotowe, statyczne pliki z etapu 'builder'
# ze ścieżki /app/dist do domyślnego folderu serwera Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Kopiujemy naszą własną konfigurację Nginx, aby obsłużyć routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Odsłaniamy port 80, na którym działa Nginx
EXPOSE 80

# Domyślne polecenie Nginx, które uruchomi serwer
CMD ["nginx", "-g", "daemon off;"]