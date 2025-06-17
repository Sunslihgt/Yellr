# Backend auth-service Dockerfile
FROM node:20-alpine

# Add build argument with default value
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
RUN echo "NODE_ENV: ${NODE_ENV}"

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY .env ./

# Install dependencies
RUN npm install --include=dev

COPY src ./src

# Generate Prisma Client
RUN npx prisma generate

# Only build in production mode
RUN if [ "$NODE_ENV" = "production" ]; \
    then npm run build; \
    fi

# Create entrypoint script
COPY <<EOF /app/entrypoint.sh
#!/bin/sh
set -e

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
while ! nc -z mysql 3306; do
  sleep 1
done
echo "MySQL is ready!"

# Run migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Start the application
if [ "$NODE_ENV" = "production" ]; then
  npm start
else
  npm run dev
fi
EOF

RUN chmod +x /app/entrypoint.sh

# Use entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]
