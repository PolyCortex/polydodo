from flask import Flask, request
from flask_cors import CORS
from waitress import serve
from http import HTTPStatus

from classification.file_loading import get_raw_array
from classification.predict import predict
from classification.exceptions import ClassificationError
from classification.config.constants import Sex, ALLOWED_FILE_EXTENSIONS
from classification.load_model import load_model, load_hmm

app = Flask(__name__)
model = {
    'classifier': load_model(),
    'postprocessing': load_hmm()
}


def allowed_file(filename):
    return filename.lower().endswith(ALLOWED_FILE_EXTENSIONS)


@app.route("/")
def status():
    return ""


@app.route('/analyze-sleep', methods=['POST'])
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

    form_data = request.form.to_dict()

    try:
        age = int(form_data['age'])
        sex = Sex[form_data['sex']]
        stream_start = int(form_data['stream_start'])
        bedtime = int(form_data['bedtime'])
        wakeup = int(form_data['wakeup'])
    except (KeyError, ValueError):
        return 'Missing or invalid request parameters', HTTPStatus.BAD_REQUEST

    try:
        raw_array = get_raw_array(file)
        predict(raw_array, model, info={
            'sex': sex,
            'age': age,
            'in_bed_seconds': bedtime - stream_start,
            'out_of_bed_seconds': wakeup - stream_start
        })
    except ClassificationError as e:
        return e.message, HTTPStatus.BAD_REQUEST

    with open("assets/mock_response.json", "r") as mock_response_file:
        return mock_response_file.read()


CORS(app,
     resources={r'/*': {"origins": '*'}},
     allow_headers='Content-Type')
app.config['CORS_HEADERS'] = 'Content-Type'

serve(app, host='0.0.0.0', port=8080)
