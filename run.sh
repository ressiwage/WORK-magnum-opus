#!/bin/bash
docker build -t site-img .
docker run --name site --expose=80 -p 80:80 -d site-img:latest