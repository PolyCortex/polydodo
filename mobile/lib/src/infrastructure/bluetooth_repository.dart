import 'dart:async';

import 'package:flutter_blue/flutter_blue.dart';
import 'package:polydodo/src/domain/bluetooth/i_bluetooth_repository.dart';
import 'package:polydodo/src/domain/bluetooth/bluetooth.dart';

class BluetoothRepository implements IBluetoothRepository {
  static List<Bluetooth> bluetoothPersistency = [];
  final streamController = StreamController<List<Bluetooth>>();

  @override
  Future<void> addDevice(BluetoothDevice device) async {
    await Future.delayed(Duration(milliseconds: 400));
    Bluetooth d = new Bluetooth(device);
    final idx = bluetoothPersistency.indexOf(d);
    idx == -1 ? bluetoothPersistency.add(d) : bluetoothPersistency[idx] = d;
    streamController.add(bluetoothPersistency);
  }

  @override
  Stream<List<Bluetooth>> watch() => streamController.stream;
}
