from flask import Flask, request
from flask_cors import CORS
from waitress import serve
from http import HTTPStatus

from classification.file_loading import get_raw_array
from classification.predict import predict

app = Flask(__name__)


def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'txt', 'csv'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def hello():
    return "Hello, World!"


@app.route('/analyze-sleep', methods=['GET'])
def analyze_sleep():
    """
    Request payload example
    {
        "file": File(...),
        "device": "CYTON",
        "sex": "F",
        "age": "23",
        "stream_start": 1602895800000,
        "bedtime": 1602898320000,
        "wakeup": 1602931800000
    }
    """
    if 'file' not in request.files:
        return 'Missing file', HTTPStatus.BAD_REQUEST
    file = request.files['file']

    if file.filename == '':
        return 'No selected file', HTTPStatus.BAD_REQUEST

    if not allowed_file(file.filename):
        return 'File format not allowed', HTTPStatus.BAD_REQUEST

    raw_array = get_raw_array(file)

    form_data = request.form.to_dict()
    predict(raw_array, **form_data)

    return ''


CORS(app,
     resources={r'/*': {"origins": '*'}},
     allow_headers='Content-Type')
app.config['CORS_HEADERS'] = 'Content-Type'

serve(app, host='0.0.0.0', port=8080)
