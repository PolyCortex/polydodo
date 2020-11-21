<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/wiki/PolyCortex/polydodo/img/dodo.png" alt="Polydodo" height="175">
  <br>
  Polydodo
  <br>
</h1>

<h4 align="center">A simple automatic sleep scoring tool that uses OpenBCI boards.</h4>

<p align="center">
  <a href="https://polycortex.github.io/polydodo/#/">
    <img src="https://img.shields.io/badge/web-client-9cf"
         alt="web client">
  </a>
<img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/PolyCortex/polydodo?label=android&logoColor=green">
<img alt="GitHub all releases" src="https://img.shields.io/github/downloads/PolyCortex/polydodo/total?color=orange&label=downloads">
  <a href="http://polycortex.polymtl.ca/">
    <img src="https://img.shields.io/badge/about%20us-%E2%84%B9-blue">
  </a>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

# Polydodo: Automatic Sleep Analysis Tool

This project aims to offer a solution to record

This projects aims to offer a comprehensive guide to **record polysomnographic EEG data from home** with an OpenBCI, a website to **upload sleep data** to our classifier and an **interactive visualisation** tool to observe the classified night of sleep.

## Key features


## How to use

## How it works

## Credits

## Support

## License

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
