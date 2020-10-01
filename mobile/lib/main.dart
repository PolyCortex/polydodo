import 'package:polydodo/protos/helloworld.pbgrpc.dart';
import 'package:grpc/grpc.dart';
import 'package:flutter/material.dart';

import 'protos/helloworld.pb.dart';
import 'src/app.dart';

void main() async {
  // GRPC TEST
  final channel = ClientChannel(
    const String.fromEnvironment('HOST'),
    port: 9090,
    options: const ChannelOptions(credentials: ChannelCredentials.insecure()),
  );
  final stub = GreeterClient(channel);

  try {
    final response = await stub.sayHello(HelloRequest()..name = 'world');
    print('Greeter client received: ${response.message}');
  } catch (e) {
    print('Caught error: $e');
  }
  await channel.shutdown();
  // END OF TEST
  runApp(App());
}
