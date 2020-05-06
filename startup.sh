#!/bin/sh


if [ $( docker ps -aq --filter name=ert-web) ]; then docker rm -f ert-web;fi
docker run -it -d -p 11000:11000 --name="ert-web" --network demo --network-alias ert-web ert-web
