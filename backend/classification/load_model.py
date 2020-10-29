from os import path
import hashlib
import sys
from requests import get
import onnxruntime

SCRIPT_PATH = path.dirname(path.realpath(sys.argv[0]))
MODEL_FILENAME = 'model.onnx'
MODEL_PATH = f'{SCRIPT_PATH}/{MODEL_FILENAME}'
MODEL_REPO = 'polycortex/polydodo-model'
MODEL_URL = f'https://raw.githubusercontent.com/{MODEL_REPO}/master/{MODEL_FILENAME}'


def _download_file(url, output):
    with open(output, 'wb') as f:
        f.write(get(url).content)


def _get_latest_model_githash():
    request = f'https://api.github.com/repos/{MODEL_REPO}/commits/master'
    repo = get(request).json()
    model_info = [file_info for file_info in repo['files'] if file_info['filename'] == MODEL_FILENAME][0]
    return model_info["sha"]


def _get_file_githash(filepath):
    BUF_SIZE = 65536

    sha1 = hashlib.sha1()

    # https://stackoverflow.com/a/1869911
    filesize = path.getsize(filepath)
    git_hash_header = f'blob {filesize}\0'.encode('utf-8')
    sha1.update(git_hash_header)

    # https://stackoverflow.com/a/22058673
    with open(filepath, 'rb') as f:
        while True:
            data = f.read(BUF_SIZE)
            if not data:
                break
            sha1.update(data)
    return sha1.hexdigest()


def load_model():
    if not path.exists(MODEL_PATH) or _get_file_githash(MODEL_PATH) != _get_latest_model_githash():
        print("downloading model")
        _download_file(MODEL_URL, MODEL_PATH)
    return onnxruntime.InferenceSession(MODEL_PATH)
