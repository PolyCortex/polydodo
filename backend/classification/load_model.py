from datetime import datetime
import logging
from os import path, makedirs
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET

import certifi
import numpy as np
from requests import get
import onnxruntime

from classification.config.constants import HiddenMarkovModelProbability


_logger = logging.getLogger(__name__)


SCRIPT_PATH = Path(path.realpath(sys.argv[0])).parent

BUCKET_NAME = 'polydodo'
BUCKET_URL = f'https://{BUCKET_NAME}.s3.amazonaws.com'

MODEL_FILENAME = 'model.onnx'
MODEL_PATH = SCRIPT_PATH / MODEL_FILENAME
MODEL_URL = f'{BUCKET_URL}/{MODEL_FILENAME}'

HMM_FOLDER = 'hmm_model'


def _download_file(url, output):
    with open(output, 'wb') as f:
        f.write(get(url, verify=certifi.where()).content)


def _get_object_latest_update(filename):
    raw_result = get(BUCKET_URL, verify=certifi.where()).text
    # https://stackoverflow.com/a/15641319
    raw_result = re.sub(' xmlns="[^"]+"', '', raw_result)
    result_root_node = ET.fromstring(raw_result)
    objects_nodes = result_root_node.findall('Contents')
    object_node = [object_node for object_node in objects_nodes if object_node.find("Key").text == filename][0]
    object_latest_update = datetime.strptime(object_node.find("LastModified").text, "%Y-%m-%dT%H:%M:%S.%f%z")

    return object_latest_update


def _has_latest_object(filename, local_path):
    latest_model_update = _get_object_latest_update(filename)
    current_model_update = datetime.fromtimestamp(path.getmtime(local_path)).astimezone()

    return current_model_update >= latest_model_update


def load_model():
    if not path.exists(MODEL_PATH) or not _has_latest_object(MODEL_FILENAME, MODEL_PATH):
        _logger.info(
            "Downloading latest sleep stage classification model... "
            f"This could take a few minutes. (storing it to {MODEL_PATH})"
        )
        _download_file(MODEL_URL, MODEL_PATH)

    _logger.info(f"Loading latest sleep stage classification model... (from {MODEL_PATH})")
    return onnxruntime.InferenceSession(str(MODEL_PATH))


def load_hmm():
    hmm_matrices = dict()

    if not path.exists(SCRIPT_PATH / HMM_FOLDER):
        makedirs(SCRIPT_PATH / HMM_FOLDER)

    for hmm_probability in HiddenMarkovModelProbability:
        hmm_file = hmm_probability.get_filename()
        model_path = SCRIPT_PATH / HMM_FOLDER / hmm_file

        if not path.exists(model_path) or not _has_latest_object(hmm_file, model_path):
            _logger.info(f"Downloading postprocessing model... (storing it to {model_path})")
            _download_file(url=f"{BUCKET_URL}/{hmm_file}", output=model_path)

        _logger.info(f"Loading postprocessing model... (from {model_path})")
        hmm_matrices[hmm_probability.name] = np.load(str(model_path))

    return hmm_matrices
