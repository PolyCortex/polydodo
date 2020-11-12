# Backend

## Setup

Create a new virtual environment to isolate Python packages.

```bash
virtualenv -p /usr/local/bin/python3.7 venv
```

Activate your virtual environment.

```bash
source venv/bin/activate
```

Install the required dependencies.

```bash
pip install -r requirements.txt requirements-dev.txt
```

If you are running on Linux or MacOS, you also have to install OpenMP with your package manager. It is a dependency of ONNX runtime, used to load our model and make predictions.

```bash
apt-get install libgomp1    # on linux
brew install libomp         # on macos
```

## Run it locally

Activate your virtual environment.

```bash
source venv/bin/activate
```

If you want to run the backend with hot reload enabled (you must have installed the development requirements), run the following command.

```bash
hupper -m waitress app:app
```

## Run the tests

You can run our unit tests with the following command, after installing the development requirements:

```bash
pytest
```
