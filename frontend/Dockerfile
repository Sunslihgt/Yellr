# Frontend Dockerfile
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine as prod
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "start"]
