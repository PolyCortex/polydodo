# Polydodo: Automatic Sleep Analysis Tool

This projects aims to offer a comprehensive guide to **record polysomnographic EEG data from home** with an OpenBCI, a website to **upload sleep data** to our classifier and an **interactive visualisation** tool to observe the classified night of sleep.

## Dev requirements

### Web

- Install Yarn package manager

### Python

- Install Python 3 and pip
- Consider using `venv` to create a virtual environment

### Flutter

- Install the latest stable version of flutter

### VS Code

- Install VS Code
- Install the project's recommended extensions

## Dev workflow

### Web

- Open workspace `polydodo.code-workspace`
- Install Python packages by running `pip install --user -r backend/requirements.txt`
- Install node modules by running `yarn install --cwd web`
- Fetch Flutter dependencies through the `Flutter` extension
- Start dev server by running `python backend/app.py`

### Building the server as a single executable

Run `python -m PyInstaller --onefile app.py`

### Running the server locally

- [Login](https://docs.github.com/en/free-pro-team@latest/packages/using-github-packages-with-your-projects-ecosystem/configuring-docker-for-use-with-github-packages#authenticating-with-a-personal-access-token) to Github Docker registry
- `docker pull docker.pkg.github.com/polycortex/polydodo/backend:latest`
- `docker run -p 8080:8080 docker.pkg.github.com/polycortex/polydodo/backend:latest`

### Mobile

Prior to build execute build-runner to generate the app's routes.  
`flutter packages pub run build_runner watch --delete-conflicting-outputs`
