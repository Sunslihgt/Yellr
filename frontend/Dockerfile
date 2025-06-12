# Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Run
FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=build /app .

# EXPOSE 3000

CMD ["npm", "start"]
