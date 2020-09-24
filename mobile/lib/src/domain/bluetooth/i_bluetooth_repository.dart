import 'bluetooth.dart';
import 'package:flutter_blue/flutter_blue.dart';

abstract class IBluetoothRepository {
  Bluetooth selectedDevice;
  void initializeBluetooth();
  Future<void> addDevice(BluetoothDevice device);
  Future<void> connect(Bluetooth bluetoothDevice);
  void disconnect();
  void findRelevantCharacteristics();
  Future<Stream<List<int>>> startDataStream();
  void stopDataStream();
  Stream<List<Bluetooth>> watch();
}
