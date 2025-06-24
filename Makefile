.PHONY: lint lint-frontend lint-auth run-dev run-prod down import-dummy-data

lint: lint-auth lint-user lint-post lint-comment lint-frontend

lint-frontend:
	@echo "Linting frontend/"
	@if [ -d "frontend" ]; then \
		cd frontend && npm run lint; \
	else \
		echo "frontend/ directory not found."; \
	fi

lint-auth:
	@echo "Linting auth-service/"
	@if [ -d "auth" ]; then \
		cd auth && npm run lint; \
	else \
		echo "auth/ directory not found."; \
	fi

lint-user:
	@echo "Linting user-service/"
	@if [ -d "user" ]; then \
		cd user && npm run lint; \
	else \
		echo "user/ directory not found."; \
	fi

lint-post:
	@echo "Linting post-service/"
	@if [ -d "post" ]; then \
		cd post && npm run lint; \
	else \
		echo "post/ directory not found."; \
	fi

lint-comment:
	@echo "Linting comment-service/"
	@if [ -d "comment" ]; then \
		cd comment && npm run lint; \
	else \
		echo "comment/ directory not found."; \
	fi

lint-fix:
	@echo "Fixing linting errors"
	@cd auth && npm run lint:fix
	@cd user && npm run lint:fix
	@cd post && npm run lint:fix
	@cd comment && npm run lint:fix
	@cd frontend && npm run lint:fix

down:
	@echo "==========================================="
	@echo "Stopping and removing all containers"
	@echo "==========================================="
	docker-compose down --remove-orphans

run-dev: down
	@echo "==========================================="
	@echo "Starting all containers in development mode"
	@echo "==========================================="
	@NODE_ENV=development docker-compose up --build

run-prod: down
	@echo "==========================================="
	@echo "Starting all containers in production mode"
	@echo "==========================================="
	@NODE_ENV=production docker-compose up --build

clear-db:
	@read -p "Are you sure you want to clear the database? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "==========================================="
	@echo "Clearing MongoDB database"
	@echo "==========================================="
	@docker exec mongo mongosh --username root --password example admin --eval "db = db.getSiblingDB('yellr'); db.dropDatabase(); print('Dropped yellr database')" || echo "Warning: Could not clear existing data (MongoDB container might not be running)"

import-dummy-data:
	@make clear-db
	@echo "==========================================="
	@echo "Importing dummy data into MongoDB"
	@echo "==========================================="
	@echo "Importing users..."
	@docker exec -i mongo mongoimport --username root --password example --authenticationDatabase admin --db yellr --collection users --jsonArray --parseGrace=autoCast --mode upsert < tests/users.json || echo "Error: Could not import users data"
	@echo "Importing posts..."
	@docker exec -i mongo mongoimport --username root --password example --authenticationDatabase admin --db yellr --collection posts --jsonArray --parseGrace=autoCast --mode upsert < tests/posts.json || echo "Error: Could not import posts data"
	@echo "Importing follows..."
	@docker exec -i mongo mongoimport --username root --password example --authenticationDatabase admin --db yellr --collection follows --jsonArray --parseGrace=autoCast --mode upsert < tests/follows.json || echo "Error: Could not import follows data"
	@echo "Dummy data import completed!"
	@echo "Note: If you see errors above, make sure MongoDB container is running (try: make run-dev)"

npm-install:
	@echo "==========================================="
	@echo "Installing npm packages"
	@echo "==========================================="
	@cd auth && npm install
	@cd user && npm install
	@cd post && npm install
	@cd comment && npm install
	@cd frontend && npm install