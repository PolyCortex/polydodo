FROM namely/protoc-all as generator
WORKDIR /
COPY protos protos
COPY web web
RUN protoc --proto_path=protos protos/* --js_out=web/src/protos

FROM node:14 as builder
COPY --from=generator /web /web
WORKDIR /web
RUN yarn install
RUN yarn build

FROM nginx:alpine
COPY --from=builder /web/build/ /usr/share/nginx/html
