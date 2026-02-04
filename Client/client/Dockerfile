# /Client/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Le port par défaut de CRA
EXPOSE 3000

CMD ["npm", "start"]