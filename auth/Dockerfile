# Backend auth-service Dockerfile
FROM node:20-alpine

# Add build argument with default value
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
RUN echo "NODE_ENV: ${NODE_ENV}"

WORKDIR /app

COPY package*.json ./

# Install dependencies based on environment
RUN if [ "$NODE_ENV" = "production" ]; \
    then npm install --production; \
    else npm install; \
    fi

COPY src .
COPY tsconfig.json .

# Only build in production mode
RUN if [ "$NODE_ENV" = "production" ]; \
    then npm run build; \
    fi

EXPOSE 5000

# Use different commands based on environment
CMD if [ "$NODE_ENV" = "production" ]; \
    then npm start; \
    else npm run dev; \
    fi
