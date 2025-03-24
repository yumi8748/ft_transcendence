all: build

build:
	mkdir -p volumes/database/ 
	docker compose -f ./docker-compose.yml up --build -d

stop:
	docker-compose -f ./docker-compose.yml stop

start:
	docker-compose -f ./docker-compose.yml start

clean:
	docker compose -f ./docker-compose.yml down -v --rmi all --remove-orphans

ls-container:	
	docker compose -f ./docker-compose.yml ps

ls-volume:
	docker volume ls

ls-network:
	docker network ls

ls-all:
	docker image ls
	docker ps -a

clean-all:
	@if [ -n "$$(docker ps -qa)" ]; then docker stop $$(docker ps -qa); fi
	@if [ -n "$$(docker ps -qa)" ]; then docker rm $$(docker ps -qa); fi
	@if [ -n "$$(docker images -qa)" ]; then docker rmi $$(docker images -qa); fi
	@if [ -n "$$(docker volume ls -q)" ]; then docker volume rm $$(docker volume ls -q); fi
	@if [ -n "$$(docker network ls -q | grep -v 'bridge\|host\|none')" ]; then docker network rm $$(docker network ls -q | grep -v 'bridge\|host\|none'); fi || true

re: clean all

.PHONY: all build stop start clean ls-container ls-volume ls-network ls-all clean-all re
