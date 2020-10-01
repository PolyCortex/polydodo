#!/usr/bin/env sh

set -m
python3 app.py &
envoy -c envoy.yaml
