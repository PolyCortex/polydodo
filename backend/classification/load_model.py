from datetime import datetime
from os import path, makedirs
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET

import certifi
import numpy as np
from requests import get
import onnxruntime

from classification.config.constants import (
    HMM_EMISSION_MATRIX,
    HMM_START_PROBABILITIES,
    HMM_TRANSITION_MATRIX,
)

SCRIPT_PATH = Path(path.realpath(sys.argv[0])).parent

BUCKET_NAME = 'polydodo'
BUCKET_URL = f'https://{BUCKET_NAME}.s3.amazonaws.com'

MODEL_FILENAME = 'model.onnx'
MODEL_PATH = SCRIPT_PATH / MODEL_FILENAME
MODEL_URL = f'{BUCKET_URL}/{MODEL_FILENAME}'

HMM_FOLDER = 'hmm_model'
HMM_FILENAMES = [
    (HMM_EMISSION_MATRIX, 'hmm_emission_probabilites.npy'),
    (HMM_START_PROBABILITIES, 'hmm_start_probabilities.npy'),
    (HMM_TRANSITION_MATRIX, 'hmm_transition_probabilites.npy')
]


def _download_file(url, output):
    with open(output, 'wb') as f:
        f.write(get(url, verify=certifi.where()).content)


def _get_latest_object_information(filename):
    raw_result = get(BUCKET_URL, verify=certifi.where()).text
    # https://stackoverflow.com/a/15641319
    raw_result = re.sub(' xmlns="[^"]+"', '', raw_result)
    result_root_node = ET.fromstring(raw_result)
    objects_nodes = result_root_node.findall('Contents')
    object_node = [object_node for object_node in objects_nodes if object_node.find("Key").text == filename][0]
    object_size = int(object_node.find("Size").text)
    object_latest_update = datetime.strptime(object_node.find("LastModified").text, "%Y-%m-%dT%H:%M:%S.%f%z")

    return {'size': object_size, 'latest_update': object_latest_update}


def _has_latest_object(filename, local_path):
    latest_model_information = _get_latest_object_information(filename)
    current_model_size = path.getsize(local_path)
    current_model_update = datetime.fromtimestamp(path.getmtime(local_path)).astimezone()

    return (
        current_model_update >= latest_model_information['latest_update']
        and current_model_size == latest_model_information['size']
    )


def load_model():
    if not path.exists(MODEL_PATH) or not _has_latest_object(MODEL_FILENAME, MODEL_PATH):
        print("Downloading latest model...")
        _download_file(MODEL_URL, MODEL_PATH)
    print("Loading model...")
    return onnxruntime.InferenceSession(str(MODEL_PATH))


def load_hmm():
    hmm_matrices = dict()

    if not path.exists(SCRIPT_PATH / HMM_FOLDER):
        makedirs(SCRIPT_PATH / HMM_FOLDER)

    for hmm_object_name, hmm_file in HMM_FILENAMES:
        model_path = SCRIPT_PATH / HMM_FOLDER / hmm_file

        if not path.exists(model_path) or not _has_latest_object(hmm_file, model_path):
            print(f"Downloading latest {hmm_object_name} HMM matrix...")
            _download_file(url=f"{BUCKET_URL}/{hmm_file}", output=model_path)

        hmm_matrices[hmm_object_name] = np.load(str(model_path))

    return hmm_matrices
