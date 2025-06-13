#!/bin/bash

echo "Linting frontend/"
if [ -d "frontend" ]; then
    (cd frontend && npm run lint)
else
    echo "frontend/ directory not found."
fi

echo
echo "Linting auth-service/"
if [ -d "auth" ]; then
    (cd auth && npm run lint)
else
    echo "auth/ directory not found."
fi