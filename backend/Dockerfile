FROM ubuntu as builder
RUN apt update && apt install -y protobuf-compiler
COPY protos protos
COPY backend backend
RUN protoc --proto_path=protos protos/* --python_out=backend/protos 

FROM python
COPY --from=builder /backend /backend
WORKDIR /backend
RUN pip install -r requirements.txt --no-cache-dir
ENTRYPOINT ["python", "app.py"]
