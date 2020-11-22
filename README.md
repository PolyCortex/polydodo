# Polydodo: Automatic Sleep Analysis Tool

This projects aims to offer a comprehensive guide to **record polysomnographic EEG data from home** with an OpenBCI, a website to **upload sleep data** to our classifier and an **interactive visualisation** tool to observe the classified night of sleep.

## Try our apps on the fly
#### Web
Our latest running web-app is live on github pages.  

[![dodo](https://img.shields.io/badge/Web-Run_the_latest_web_app-blueviolet?style=flat_square&logo=React)](https://polycortex.github.io/polydodo)
#### Mobile
Until we are able to publish our Android and iOS apps, you can get the latest .apk release and install it on your Android device.  

[![dodo](https://img.shields.io/badge/Android-Get_the_Latest_apk-blueviolet?style=flat_square&logo=android)](https://github.com/PolyCortex/polydodo/releases/latest/download/polydodo_app_android.apk)

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

- Prior to build, execute build-runner at the root of the mobile folder to generate the app's routes.  
`flutter packages pub run build_runner watch --delete-conflicting-outputs`
- You can build the project and try it on your Android device or with the Android emulator.
  - If you don't own any Android device and still want to try our app, head to [Install android emulator](https://developer.android.com/studio/run/emulator) to install the emulator.
  - Build & Launch configurations are already setted for VSCode. Head to the **Run** tab and run the **Mobile debug** option.
