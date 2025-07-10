# syntax = docker/dockerfile:1.2
FROM node:18-alpine

# Install git (required to get latest version of shallowpink)
RUN apk add --no-cache git

WORKDIR /code

COPY . .

# remove cached github dependencies
RUN rm -rf node_modules/ package-lock.json

RUN npm install

RUN npm run build

ENV NEXT_PUBLIC_CHESSTICULATE_API_URL=https://api.chess.brgdev.xyz

EXPOSE 3000

CMD ["npm", "run", "start"]
