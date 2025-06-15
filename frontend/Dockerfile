# Frontend Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

# Dependencies
COPY package*.json ./
COPY src ./src
COPY public ./public
COPY tsconfig.json .

# Install dependencies
RUN npm install --include=dev

# Build
RUN npm run build

# Run
FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=build /app .

CMD ["npm", "start"]
