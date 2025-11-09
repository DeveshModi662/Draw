FROM node:24.11.0-alpine AS build
WORKDIR /doroUIApp
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]
