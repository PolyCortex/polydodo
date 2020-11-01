from datetime import datetime
from os import path
import re
import sys
import xml.etree.ElementTree as ET

from pytz import utc
from requests import get
import onnxruntime

SCRIPT_PATH = path.dirname(path.realpath(sys.argv[0]))
MODEL_FILENAME = 'model.onnx'
MODEL_PATH = f'{SCRIPT_PATH}/{MODEL_FILENAME}'
MODEL_BUCKET = 'polydodo'
BUCKET_URL = f'https://{MODEL_BUCKET}.s3.amazonaws.com'
MODEL_URL = f'{BUCKET_URL}/{MODEL_FILENAME}'


def _download_file(url, output):
    with open(output, 'wb') as f:
        f.write(get(url).content)


def _get_latest_object_information(bucket_url, filename):
    raw_result = get(bucket_url).text
    # https://stackoverflow.com/a/15641319
    raw_result = re.sub(' xmlns="[^"]+"', '', raw_result)
    result_root_node = ET.fromstring(raw_result)
    objects_nodes = result_root_node.findall('Contents')
    object_node = [object_node for object_node in objects_nodes if object_node.find("Key").text == filename][0]
    object_size = int(object_node.find("Size").text)
    object_latest_update = datetime.strptime(object_node.find("LastModified").text, "%Y-%m-%dT%H:%M:%S.%f%z")

    return {'size': object_size, 'latest_update': object_latest_update}


def _has_latest_model():
    latest_model_information = _get_latest_object_information(BUCKET_URL, MODEL_FILENAME)
    current_model_size = path.getsize(MODEL_PATH)
    current_model_update = utc.localize(datetime.fromtimestamp(path.getmtime(MODEL_PATH)))

    return (
        current_model_update >= latest_model_information['latest_update']
        and current_model_size == latest_model_information['size']
    )


def load_model():
    if not path.exists(MODEL_PATH) or not _has_latest_model():
        print("Downloading latest model...")
        _download_file(MODEL_URL, MODEL_PATH)
    print("Loading model...")
    return onnxruntime.InferenceSession(MODEL_PATH)
