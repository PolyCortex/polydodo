# FROM namely/protoc-all as generator
# WORKDIR /
# COPY protos protos
# COPY backend backend
# RUN protoc --proto_path=protos protos/* --python_out=backend/protos 

# FROM python
# COPY --from=generator /backend /backend
# WORKDIR /backend
# RUN pip install -r requirements.txt --no-cache-dir
# ENTRYPOINT ["python", "app.py"]

# Need to run in order for grpc-web to communicate with server.
FROM envoyproxy/envoy:v1.14.4
COPY ./envoy.yaml /etc/envoy/envoy.yaml
CMD /usr/local/bin/envoy -c /etc/envoy/envoy.yaml
