.PHONY: lint lint-frontend lint-auth run-dev run-prod down

lint: lint-frontend lint-auth lint-user lint-post

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
