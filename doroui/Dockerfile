FROM node:24.11.0-alpine AS build
WORKDIR /doroUIApp
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
ENV PORT=80
FROM nginx:alpine
COPY --from=build /doroUIApp/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]