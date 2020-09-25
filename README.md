# Polydodo: Automatic Sleep Analysis Tool

This projects aims to offer a comprehensive guide to **record polysomnographic EEG data from home** with an OpenBCI, a website to **upload sleep data** to our classifier and an **interactive visualisation** tool to observe the classified night of sleep.

## Dev requirements

### gRPC

- Install `gRPC` package from your distribution's package manager
- Install `protoc` compiler

### Web

- Install Yarn package manager
- `yarn global add protoc-gen-grpc-web`
- Add `$HOME/.yarn/bin` to `PATH`

### Python

- Install Python 3 and pip
- Consider using `venv` to create a virtual environment
- Install `protoc-gen-grpc_python` using a package manager or by compiling the [source code](https://github.com/grpc/grpc) 
- Create a simlink named `protoc-gen-grpc_python` to `grpc_python_plugin` using `ln -nsf $(which grpc_python_plugin) /some/where/in/your/path/protoc-gen-grpc_python`

### Flutter

- Install the latest stable version of flutter
- Run `flutter pub global activate protoc_plugin`
- Add `$HOME/.pub-cache/bin` to `PATH`

### VS Code

- Install VS Code
- Install the project's recommended extensions

## Dev workflow

- Open root folder on VS Code
- Install node modules by running `yarn install --cwd web`
- Fetch Flutter dependencies through the `Flutter` extension
- Compile all protos through `proto3` extension
