# syntax = docker/dockerfile:1.2
FROM node:20.9-alpine

WORKDIR /code

COPY . .

RUN npm install
RUN npm update shallowpink

ARG NEXT_PUBLIC_CHESSTICULATE_API_URL

ENV NEXT_PUBLIC_CHESSTICULATE_API_URL=${NEXT_PUBLIC_CHESSTICULATE_API_URL}

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
