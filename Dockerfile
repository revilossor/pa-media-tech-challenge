FROM node:12.20.0-alpine3.12

WORKDIR /opt/app/pa-media/api

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

CMD npm start
