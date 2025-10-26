.PHONY: help install dev api frontend build clean verify setup

help: ## Show this help message
	@echo "Bee Algorithm Platform - Development Commands"
	@echo "=============================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "Installing Python dependencies..."
	cd bee-fastapi && pip install -r requirements.txt
	@echo "Installing Node.js dependencies..."
	cd algoabcapp && npm install

dev: ## Start both frontend and backend in development mode
	@echo "Starting development servers..."
	@echo "Backend will run on http://localhost:8001"
	@echo "Frontend will run on http://localhost:3000"
	@echo "Press Ctrl+C to stop both servers"
	@trap 'kill %1; kill %2' INT; \
	cd bee-fastapi && uvicorn main:app --reload --port 8001 & \
	cd algoabcapp && NEXT_PUBLIC_BEE_API=http://localhost:8001 npm run dev & \
	wait

api: ## Start only the FastAPI backend
	@echo "Starting FastAPI backend on http://localhost:8001"
	cd bee-fastapi && uvicorn main:app --reload --port 8001

frontend: ## Start only the Next.js frontend
	@echo "Starting Next.js frontend on http://localhost:3000"
	cd algoabcapp && NEXT_PUBLIC_BEE_API=http://localhost:8001 npm run dev

build: ## Build both frontend and backend for production
	@echo "Building frontend..."
	cd algoabcapp && npm run build
	@echo "Building backend..."
	cd bee-fastapi && echo "Backend is ready for deployment"

clean: ## Clean node_modules and Python cache
	@echo "Cleaning up..."
	cd algoabcapp && rm -rf node_modules .next
	cd bee-fastapi && find . -type d -name "__pycache__" -exec rm -rf {} +
	@echo "Cleanup complete"

docker: ## Start with Docker Compose
	@echo "Starting with Docker Compose..."
	docker-compose up --build

docker-stop: ## Stop Docker Compose
	@echo "Stopping Docker Compose..."
	docker-compose down

setup: ## Run automated setup script
	@echo "Running automated setup..."
	@if [ -f "./setup.sh" ]; then \
		chmod +x ./setup.sh && ./setup.sh; \
	else \
		echo "Setup script not found. Please run manual installation."; \
	fi

verify: ## Verify installation and setup
	@echo "Verifying setup..."
	node verify-setup.js
