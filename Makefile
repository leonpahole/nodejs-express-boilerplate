install:
	docker-compose -f docker-compose.builder.yml run --rm install

build:
	docker-compose build

dev:
	docker-compose up -d

stop:
	docker-compose down

clean:
	docker-compose down -v
	
logs:
	docker-compose logs -f api

status:
	docker-compose ps

exec:
	docker-compose exec api bash

migrate:
	docker-compose exec api yarn migrate

seed:
	docker-compose exec api yarn seed