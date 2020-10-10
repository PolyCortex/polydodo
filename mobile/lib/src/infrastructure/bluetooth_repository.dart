import 'dart:async';

import 'package:flutter/services.dart';
import 'package:flutter_reactive_ble/flutter_reactive_ble.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/domain/unique_id.dart';

class BluetoothRepository implements IAcquisitionDeviceRepository {
  static const String BLE_SERVICE = "0000fe84-0000-1000-8000-00805f9b34fb";
  static const String BLE_RECEIVE = "2d30c082-f39f-4ce6-923f-3484ea480596";
  static const String BLE_SEND = "2d30c083-f39f-4ce6-923f-3484ea480596";
  static const startStreamChar = 'b';
  static const stopStreamChar = 's';

  DiscoveredDevice _selectedDevice;
  QualifiedCharacteristic _sendCharacteristic;
  QualifiedCharacteristic _receiveCharacteristic;

  FlutterReactiveBle flutterReactiveBle;
  StreamSubscription<DiscoveredDevice> _bluetoothScanSubscription;
  List<AcquisitionDevice> _acquisitionDevicePersistency = [];
  List<DiscoveredDevice> _bluetoothDevices = [];
  final streamController = StreamController<List<AcquisitionDevice>>();

  BluetoothRepository();

  void initializeRepository() {
    if (_bluetoothScanSubscription == null) {
      flutterReactiveBle = FlutterReactiveBle();

      _bluetoothScanSubscription = flutterReactiveBle
          .scanForDevices()
          .listen((device) => addDevice(device));
    } else {
      _bluetoothScanSubscription.resume();
    }
  }

  void addDevice(DiscoveredDevice bluetoothDevice) {
    print(bluetoothDevice);
    AcquisitionDevice device = AcquisitionDevice(
        UniqueId.from(bluetoothDevice.id.toString()), bluetoothDevice.name);

    final idx = _acquisitionDevicePersistency.indexOf(device);

    if (idx == -1) {
      _acquisitionDevicePersistency.add(device);
      _bluetoothDevices.add(bluetoothDevice);
    } else {
      _acquisitionDevicePersistency[idx] = device;
      _bluetoothDevices[idx] = bluetoothDevice;
    }

    streamController.add(_acquisitionDevicePersistency);
  }

  Future<void> connect(AcquisitionDevice device) async {
    _selectedDevice =
        _bluetoothDevices[_acquisitionDevicePersistency.indexOf(device)];
    print("haha");
    print(_selectedDevice);
    _acquisitionDevicePersistency.clear();
    _bluetoothDevices.clear();
    _bluetoothScanSubscription.pause();
    _bluetoothScanSubscription.cancel();

    try {
      flutterReactiveBle
          .connectToDevice(id: _selectedDevice.id)
          .timeout(Duration(seconds: 10));
    } catch (e) {
      print(e);
      // onTimeout: () => {disconnect(), throw Exception("Connection Timed out")};
      if (e is PlatformException) {
        if (e.code != "already_connected") throw Exception(e.details);
      } else
        throw e;
    }
  }

  Future<void> disconnect() async {
    if (_selectedDevice != null) {
      _selectedDevice = null;
    }
  }

  Future<void> findRelevantCharacteristics() async {
    _sendCharacteristic = QualifiedCharacteristic(
        characteristicId: Uuid.parse(BLE_SEND),
        serviceId: Uuid.parse(BLE_SERVICE),
        deviceId: _selectedDevice.id);
    _receiveCharacteristic = QualifiedCharacteristic(
        characteristicId: Uuid.parse(BLE_RECEIVE),
        serviceId: Uuid.parse(BLE_SERVICE),
        deviceId: _selectedDevice.id);

    print(_sendCharacteristic);
    print(_receiveCharacteristic);
  }

  Future<Stream<List<int>>> startDataStream() async {
    findRelevantCharacteristics();
    try {
      await flutterReactiveBle.requestConnectionPriority(
          deviceId: _selectedDevice.id,
          priority: ConnectionPriority.highPerformance);
      flutterReactiveBle.writeCharacteristicWithoutResponse(_sendCharacteristic,
          value: startStreamChar.codeUnits);
    } catch (e) {
      print(e);
    }

    return flutterReactiveBle.subscribeToCharacteristic(_receiveCharacteristic);
  }

  Future<void> stopDataStream() async {
    try {
      await flutterReactiveBle.requestConnectionPriority(
          deviceId: _selectedDevice.id, priority: ConnectionPriority.balanced);
      flutterReactiveBle.writeCharacteristicWithoutResponse(_sendCharacteristic,
          value: stopStreamChar.codeUnits);
    } catch (e) {
      print(e);
    }
  }

  @override
  Stream<List<AcquisitionDevice>> watch() => streamController.stream;
}
