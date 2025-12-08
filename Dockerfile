# syntax = docker/dockerfile:1.2
FROM node:20.9-alpine

WORKDIR /code

COPY . .

RUN npm install
RUN npm update shallowpink

ENV NEXT_PUBLIC_CHESSTICULATE_API_URL=https://api.chess.brgdev.xyz

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
