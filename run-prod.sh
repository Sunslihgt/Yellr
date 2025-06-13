#!/bin/bash
export NODE_ENV=production

echo "========================================="
echo "Stopping and removing all containers"
echo "========================================="

docker-compose down --remove-orphans

echo "========================================="
echo "Starting all containers in ${NODE_ENV} mode"
echo "========================================="

docker-compose up --build
