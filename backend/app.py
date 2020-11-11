from flask import Flask, request
from flask_cors import CORS
from waitress import serve
from http import HTTPStatus

from backend.request import ClassificationRequest
from backend.response import ClassificationResponse
from backend.spectrogram_generator import SpectrogramGenerator
from classification.parser import get_raw_array
from classification.exceptions import ClassificationError
from classification.config.constants import Sex, AcquisitionBoard, ALLOWED_FILE_EXTENSIONS
from classification.model import SleepStagesClassifier
from classification.features.preprocessing import preprocess

app = Flask(__name__)
sleep_stage_classifier = SleepStagesClassifier()


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
    raw_array = get_raw_array(file)
    print(AcquisitionBoard[form_data['device']])

    try:
        classification_request = ClassificationRequest(
            age=int(form_data['age']),
            sex=Sex[form_data['sex']],
            stream_start=int(form_data['stream_start']),
            bedtime=int(form_data['bedtime']),
            wakeup=int(form_data['wakeup']),
            board=AcquisitionBoard[form_data['device']],
            raw_eeg=raw_array,
        )
    except (KeyError, ValueError, ClassificationError):
        return 'Missing or invalid request parameters', HTTPStatus.BAD_REQUEST

    preprocessed_epochs = preprocess(classification_request)
    predictions = sleep_stage_classifier.predict(preprocessed_epochs, classification_request)
    spectrogram_generator = SpectrogramGenerator(preprocessed_epochs)
    classification_response = ClassificationResponse(
        classification_request, predictions, spectrogram_generator.generate()
    )

    return classification_response.response


CORS(app,
     resources={r'/*': {"origins": '*'}},
     allow_headers='Content-Type')
app.config['CORS_HEADERS'] = 'Content-Type'

serve(app, host='0.0.0.0', port=8080)
