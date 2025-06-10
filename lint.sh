#!/bin/bash

echo "Linting frontend/"
if [ -d "frontend" ]; then
    (cd frontend && npm run lint)
else
    echo "frontend/ directory not found."
fi

echo
echo "Linting backend/"
if [ -d "backend" ]; then
    (cd backend && npm run lint)
else
    echo "backend/ directory not found."
fi