FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]

#Por simplicidade, estamos usando um build mono stage, mas em produção seria utilizado multi stage para um imagem final otimizada.