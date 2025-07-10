# syntax = docker/dockerfile:1.2
FROM node:18-alpine

WORKDIR /code

COPY . .

RUN npm install
RUN npm update shallowpink

RUN npm run build

ENV NEXT_PUBLIC_CHESSTICULATE_API_URL=https://api.chess.brgdev.xyz

EXPOSE 3000

CMD ["npm", "run", "start"]
