# Polydodo: Automatic Sleep Analysis Tool

This projects aims to offer a comprehensive guide to **record polysomnographic EEG data from home** with an OpenBCI, a website to **upload sleep data** to our classifier and an **interactive visualisation** tool to observe the classified night of sleep.

## Requirements

### GRPC and proto generation

First thing to do is to install protoc via dart's protoc_plugin. To do so:

> flutter pub global activate protoc_plugin

In order to be able to proceed to GRPC and proto generation, you need to run `sh ./install_grpc_python_plugin` under the protos/ folder.

When you'll save `.proto` files, this will automatically generate langage specific code to use GRPC.

### Backend development

You'll need install venv with `python -m pip install virtualenv`. Then you can create a virtual environment. Be sure that you link your venv `python` executable to your code editor/terminal.
