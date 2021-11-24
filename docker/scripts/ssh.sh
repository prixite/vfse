#!/usr/bin/env bash
# Run this command in vFSE container. For example:
# `````
# ./docker/scripts/ssh.sh npm run watch
# `````
# Or
# `````
# ./docker/scripts/ssh.sh ./manage.py runserver 0.0.0.0:8000
# `````
if [[ $# = 0 ]]; then
	args=bash
else
	args="${@:1}"
fi

container=vfse

docker inspect --format={{.State.Running}} $container &> /dev/null

if [[ $? = 1 ]]; then
	docker-compose run --rm --service-ports --name "$container" app $args
else
	docker exec -it $container $args
fi
