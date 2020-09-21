FROM namely/protoc-all as generator
WORKDIR /
COPY protos protos
COPY backend backend
RUN protoc --proto_path=protos protos/* --python_out=backend/protos 

FROM python
COPY --from=generator /backend /backend
WORKDIR /backend
RUN pip install -r requirements.txt --no-cache-dir
ENTRYPOINT ["python", "app.py"]
