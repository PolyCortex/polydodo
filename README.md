# Polydodo: Automatic Sleep Analysis Tool

This projects aims to offer a comprehensive guide to **record polysomnographic EEG data from home** with an OpenBCI, a website to **upload sleep data** to our classifier and an **interactive visualisation** tool to observe the classified night of sleep.

## Requirements

### GRPC and proto generation

In order to be able to proceed to GRPC and proto generation, you need to run `sh ./install_grpc_plugins` under the protos/ folder.

### Backend development

You'll need install venv with `python -m pip install virtualenv`. Then you can create a virtual environment. Be sure that you link your venv `python` executable to your code editor/terminal.
