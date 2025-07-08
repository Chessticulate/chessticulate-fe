# syntax = docker/dockerfile:1.2
FROM node:18-alpine

WORKDIR /code

COPY . /code

ENV NEXT_PUBLIC_CHESSTICULATE_API_URL=https://api.chess.brgdev.xyz

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
