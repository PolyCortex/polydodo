# Need to run in order for grpc-web to communicate with server.
FROM envoyproxy/envoy:v1.14.4
COPY ./envoy.yaml /etc/envoy/envoy.yaml
CMD /usr/local/bin/envoy -c /etc/envoy/envoy.yaml
