import os
from flask import Flask, flash, request
from werkzeug.utils import secure_filename
from flask_cors import CORS
from waitress import serve
from http import HTTPStatus


SERVER_FOLDER = os.path.dirname(os.path.realpath(__file__))

app = Flask(__name__)


def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'txt', 'csv'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def hello():
    return "Hello, World!"


@app.route('/analyze_sleep', methods=['POST'])
def analyze_sleep():
    if 'file' not in request.files:
        return 'Missing file', HTTPStatus.BAD_REQUEST
    file = request.files['file']

    if file.filename == '':
        return 'No selected file', HTTPStatus.BAD_REQUEST

    if not allowed_file(file.filename):
        return 'File format not allowed', HTTPStatus.BAD_REQUEST

    file_content = file.read()
    form_data = request.form.to_dict()

    return ''


CORS(app,
     resources={r'/*': {"origins": '*'}},
     allow_headers='Content-Type')
app.config['CORS_HEADERS'] = 'Content-Type'

serve(app, host='0.0.0.0', port=8080)
