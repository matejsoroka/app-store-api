FROM node:20-alpine3.18

RUN mkdir -p /app && mkdir -p /config && apk add openssh nodejs npm

ADD ./src /app

WORKDIR /app
RUN npm install

ENTRYPOINT npm start