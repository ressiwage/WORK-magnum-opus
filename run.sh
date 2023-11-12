#!/bin/bash
docker rm site
docker build -t site-img . --no-cache
docker run --name site --expose=80 -p 80:80 -d site-img:latest