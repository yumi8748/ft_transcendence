all: build

build:
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
	-docker stop $$(docker ps -qa)
	-docker rm $$(docker ps -qa)
	-docker rmi $$(docker images -qa)
	-docker volume rm $$(docker volume ls -q)
	-docker network rm $$(docker network ls -q)

re: clean all

.PHONY: all build stop start clean ls-container ls-volume ls-network ls-all clean-all re
