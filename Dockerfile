# syntax = docker/dockerfile:1.2
FROM node:18-alpine

WORKDIR /code

COPY . /code

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
