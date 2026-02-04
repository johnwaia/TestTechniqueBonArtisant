# /server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source
COPY . .

# Le port défini dans votre server.js est 5000
EXPOSE 5000

CMD ["npm", "start"]