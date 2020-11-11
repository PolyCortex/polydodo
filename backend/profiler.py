
from waitress import serve
from werkzeug.middleware.profiler import ProfilerMiddleware
from pathlib import Path
from os import path, makedirs
import sys

from app import app

SCRIPT_PATH = Path(path.realpath(sys.argv[0])).parent
PROFILES_PATH = SCRIPT_PATH / "profiles"

if not path.exists(PROFILES_PATH):
    makedirs(PROFILES_PATH)

app = ProfilerMiddleware(app, stream=None, profile_dir="profiles")

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=8080)
