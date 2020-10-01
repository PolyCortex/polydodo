import 'package:flutter_blue/flutter_blue.dart';

abstract class IBluetoothRepository {
  void initializeBluetooth();

  Future<void> connect(BluetoothDevice bluetoothDevice);
  void disconnect();

  Future<Stream<List<int>>> startDataStream();
  void stopDataStream();

  Stream<List<BluetoothDevice>> watch();
}
