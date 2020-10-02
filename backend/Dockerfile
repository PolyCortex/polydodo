FROM namely/protoc-all as generator
WORKDIR /
COPY protos protos
COPY backend backend
RUN ln $(which grpc_python_plugin) /usr/bin/protoc-gen-grpc_python
RUN protoc protos/* --python_out=backend --grpc_python_out=backend

FROM envoyproxy/envoy:v1.15-latest
RUN apt-get update \
  && apt-get -y install python3-pip \
  && apt-get autoremove -y \
  && apt-get clean \
  && rm -rf /tmp/* /var/tmp/* \
  && rm -rf /var/lib/apt/lists/*
COPY --from=generator /backend /backend
WORKDIR /backend
RUN pip3 install -r requirements.txt --no-cache-dir
CMD "./start.sh"
