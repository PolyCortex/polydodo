echo "This script install grpc_python_plugin from source because of this https://github.com/grpc/grpc/issues/15675#issuecomment-397038811"
git clone --recursive https://github.com/grpc/grpc
cd grpc && make grpc_python_plugin -j 4
sudo mv bins/opt/grpc_python_plugin /usr/bin
cd .. && sudo rm -r grpc/

# See https://github.com/grpc/grpc-web/releases for other releases
# LINUX
wget  -O protoc-gen-grpc-web "https://github.com/grpc/grpc-web/releases/download/1.2.1/protoc-gen-grpc-web-1.2.1-linux-x86_64"
sudo mv protoc-gen-grpc-web /usr/bin

# MAC
# wget  -O protoc-gen-grpc-web https://github.com/grpc/grpc-web/releases/download/1.2.1/protoc-gen-grpc-web-1.2.1-darwin-x86_64
# sudo mv protoc-gen-grpc-web /usr/bin

chmod +x /usr/bin/protoc-gen-grpc-web
