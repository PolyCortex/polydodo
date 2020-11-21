# Polydodo web client

This web app aims to offer a comprehensive guide on **how to record polysomnographic EEG data from home** with an OpenBCI, a form to **upload sleep data** to our classifier and an **interactive scrolly-telling visualization** to observe the night of sleep. Finally, it is possible to export the classifier results for further use.

This app was designed on top of React.js and the data visualizations were created using D3.js.

## Getting started

- Install Yarn package manager
- Open workspace `polydodo.code-workspace`
- Install Python packages by running `pip install --user -r backend/requirements.txt`
- Install node modules by running `yarn install --cwd web`
- Fetch Flutter dependencies through the `Flutter` extension
- Start dev server by running `python backend/app.py`
