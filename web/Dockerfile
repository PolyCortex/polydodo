FROM node:14 as builder
RUN apt update && apt install -y protobuf-compiler
COPY protos protos
COPY web web
RUN protoc --proto_path=protos protos/* --js_out=web/src/protos 
WORKDIR /web
RUN yarn install
RUN yarn build

FROM nginx:alpine
COPY --from=builder /web/build/ /usr/share/nginx/html
