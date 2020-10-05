FROM python
COPY . /backend
WORKDIR /backend
RUN pip3 install -r requirements.txt --no-cache-dir
CMD ["python", "app.py"]
