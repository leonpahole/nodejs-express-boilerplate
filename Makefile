build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

clean:
	docker-compose down -v

logs:
	docker-compose logs -f api

ps:
	docker-compose ps

exec:
	docker-compose exec api bash

migrate:
	docker-compose exec api yarn migrate

seed:
	docker-compose exec api yarn seed

release:
	bash ./bin/build_and_release.sh

prod_deploy:
	bash ./bin/prod_deploy.sh

prod_up:
	docker-compose --env-file .env.prod -f docker-compose.prod.yml --context production up -d --remove-orphans

prod_down:
	docker-compose -f docker-compose.prod.yml --context production down

prod_clean:
	docker-compose -f docker-compose.prod.yml --context production down -v

prod_logs:
	docker-compose -f docker-compose.prod.yml --context production logs -f api

prod_ps:
	docker-compose -f docker-compose.prod.yml --context production ps

prod_migrate:
	COMPOSE_INTERACTIVE_NO_CLI=1 docker-compose -f docker-compose.prod.yml --context production exec api yarn migrate

prod_seed:
	COMPOSE_INTERACTIVE_NO_CLI=1 docker-compose -f docker-compose.prod.yml --context production exec api yarn seed