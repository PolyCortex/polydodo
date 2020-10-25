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

## Run it locally

Activate your virtual environment.

```bash
source venv/bin/activate
```

If you want to run the backend with hot reload enabled (you must have installed the development requirements), run the following command.

```bash
hupper -m waitress app:app
```
