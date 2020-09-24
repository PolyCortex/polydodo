import 'bluetooth.dart';
import 'package:flutter_blue/flutter_blue.dart';

abstract class IBluetoothRepository {
  Future<void> addDevice(BluetoothDevice device);
  Stream<List<Bluetooth>> watch();
}
