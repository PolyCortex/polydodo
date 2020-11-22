# Polydodo server

This server is responsible for the automatic sleep stage scoring of recorded EEG data. For more info about the deployed model, see [our wiki page](https://github.com/PolyCortex/polydodo/wiki/model).

## Getting started
### Prerequesites
- Install [Python 3.8](https://www.python.org/downloads/).
  - Make sure that the "Python38\Scripts" folder is added to your environnment path varible on Windows in order to use pip and hupper without any issue.

### Setup

Create a new virtual environment to isolate Python packages.
```
python -m venv .venv
```

Activate your virtual environment. This step will need to be done everytime you re-open your terminal.
- Linux/macOS:
```bash
source .venv/bin/activate
```
- Windows:
```
.\.venv\Scripts\activate.bat
```

Install the required dependencies.
```bash
pip install -r requirements.txt -r requirements-dev.txt
```

If you are running on Linux or MacOS, you also have to install OpenMP with your package manager. It is a dependency of ONNX runtime, used to load our model and make predictions.

```bash
apt-get install libgomp1    # on linux
brew install libomp         # on macos
```

## Run the server

If you want to run the backend with hot reload enabled (you must have installed the development requirements), run the following command.

```
hupper -m app
```

## Run the tests

You can run our unit tests with the following command, after installing the development requirements:

```bash
pytest
```

## Profile application
*A profile is a set of statistics that describes how often and for how long various parts of the program executed.* -[Python Software Foundation](https://docs.python.org/3/library/profile.html)

- Run `python profiler.py`

- Send the request to the server

- Open the profiler result contained in `profiles` folder with `snakeviz`

## Building the server as a single executable

Run `python -m PyInstaller --onefile app.py`
