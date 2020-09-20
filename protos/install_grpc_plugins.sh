echo "This script install grpc_python_plugin from source because of this https://github.com/grpc/grpc/issues/15675#issuecomment-397038811"
echo "It also install grpc_node_plugin from source. We prefer static generation over dynamic for nodejs"
git clone --recursive https://github.com/grpc/grpc
cd grpc && make grpc_python_plugin -j 4 && make grpc_node_plugin -j 4
sudo mv bins/opt/grpc_python_plugin /usr/bin
sudo mv bins/opt/grpc_node_plugin /usr/bin
cd .. && sudo rm -r grpc/
