# syntax = docker/dockerfile:1.2
FROM node:18-alpine

WORKDIR /code

COPY package.json ./

# remove cached github dependencies
RUN rm -rf node_modules/ package-lock.json

RUN npm install

COPY . .

ENV NEXT_PUBLIC_CHESSTICULATE_API_URL=https://api.chess.brgdev.xyz

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
