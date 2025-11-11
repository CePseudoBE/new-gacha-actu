.PHONY: help build up down restart logs clean dev prod

help:
	@echo "GachaActu Docker Commands"
	@echo "========================="
	@echo "make build    - Build all Docker images"
	@echo "make up       - Start all services"
	@echo "make down     - Stop all services"
	@echo "make restart  - Restart all services"
	@echo "make logs     - View logs (all services)"
	@echo "make clean    - Remove all containers, volumes and images"
	@echo "make dev      - Start development environment (pnpm turbo)"
	@echo "make prod     - Start production environment (docker-compose)"

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart: down up

logs:
	docker compose logs -f

logs-api:
	docker compose logs -f api

logs-web:
	docker compose logs -f web

logs-nginx:
	docker compose logs -f nginx

clean:
	docker compose down -v --rmi all

dev:
	pnpm dev

prod: build up
	@echo "Production environment started!"
	@echo "Access the app at: http://localhost"
	@echo "API endpoint: http://localhost/api"

ps:
	docker compose ps

shell-api:
	docker compose exec api sh

shell-web:
	docker compose exec web sh

migrate:
	docker compose exec api node ace migration:run

seed:
	docker compose exec api node ace db:seed
