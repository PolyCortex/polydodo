# Polydodo server

This server is responsible for the automatic sleep stage scoring of recorded EEG data. For more info about the deployed model, see [our wiki page](https://github.com/PolyCortex/polydodo/wiki/model).


## Prerequesites
- Install [Python 3.7](https://www.python.org/downloads/).
  - Make sure that the "Python37\Scripts" folder is added to your environnment path varible on Windows in order to use pip and hupper without any issue.

## Setup - Linux

Create a new virtual environment to isolate Python packages. This step will need to be done everytime you re-open your terminal.

- Linux:
```bash
virtualenv -p /usr/local/bin/python3.7 venv
```
- Windows:
```
python -m venv .venv
```

Activate your virtual environment.
- Linux:
```bash
source venv/bin/activate
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

## Run it locally

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

- Run `python profiler.py`

- Send the request to the server

- Open the profiler result contained in `profiles` folder with `snakeviz`

## Building the server as a single executable

Run `python -m PyInstaller --onefile app.py`

## Running the server locally

- [Login](https://docs.github.com/en/free-pro-team@latest/packages/using-github-packages-with-your-projects-ecosystem/configuring-docker-for-use-with-github-packages#authenticating-with-a-personal-access-token) to Github Docker registry
- `docker pull docker.pkg.github.com/polycortex/polydodo/backend:latest`
- `docker run -p 8080:8080 docker.pkg.github.com/polycortex/polydodo/backend:latest`
