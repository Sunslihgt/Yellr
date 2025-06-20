# Frontend Dockerfile
FROM node:20-alpine

# Add build argument with default value
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
RUN echo "NODE_ENV: ${NODE_ENV}"

WORKDIR /app

COPY package*.json ./
COPY public ./public
COPY tsconfig.json .
COPY postcss.config.js .
COPY tailwind.config.js .

# Install dependencies
RUN npm install --include=dev

COPY src ./src

# Only build in production mode
RUN if [ "$NODE_ENV" = "production" ]; \
    then npm run build; \
    fi

# Use different commands based on environment
CMD if [ "$NODE_ENV" = "production" ]; \
    then npm start; \
    else npm run dev; \
    fi
