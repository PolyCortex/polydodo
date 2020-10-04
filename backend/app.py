from flask import Flask
from flask_cors import CORS
from waitress import serve

app = Flask(__name__)
cors = CORS(app)


@app.route("/")
def hello():
    return "Hello, World!"


serve(app, host='0.0.0.0', port=8080)
