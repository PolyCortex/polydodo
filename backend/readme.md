# Backend

This backend holds a GRPC server that classify OpenBCI raw EEG data into sleep stages.

## How to run

I you are running the front-end, you'll need to build the dockerfile to get the Envoy proxy.

> docker build -t polydodo-web .

> docker run -d -p 8080:8080 -p 9090:9090 --network=host polydodo-web

To start the server:

> python backend/app.py

## Get requirements:

> python -m venv .venv
> python -m pip install -r requirements.txt 
