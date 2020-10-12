import 'dart:async';

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

  AcquisitionDevice _selectedDevice;
  QualifiedCharacteristic _sendCharacteristic;
  QualifiedCharacteristic _receiveCharacteristic;

  FlutterReactiveBle flutterReactiveBle;
  StreamSubscription<ConnectionStateUpdate> _connectedDeviceStream;
  StreamSubscription<DiscoveredDevice> _bluetoothScanSubscription;
  List<AcquisitionDevice> _acquisitionDevicePersistency = [];
  final streamController = StreamController<List<AcquisitionDevice>>();

  BluetoothRepository();

  void initializeRepository() {
    if (_bluetoothScanSubscription == null) {
      flutterReactiveBle = FlutterReactiveBle();

      _bluetoothScanSubscription = flutterReactiveBle.scanForDevices(
          withServices: []).listen((device) => addDevice(device));
    } else {
      _bluetoothScanSubscription.resume();
    }
  }

  void addDevice(DiscoveredDevice bluetoothDevice) {
    AcquisitionDevice device = AcquisitionDevice(
        UniqueId.from(bluetoothDevice.id.toString()), bluetoothDevice.name);

    final idx = _acquisitionDevicePersistency.indexOf(device);

    if (idx == -1) {
      _acquisitionDevicePersistency.add(device);
    } else {
      _acquisitionDevicePersistency[idx] = device;
    }

    streamController.add(_acquisitionDevicePersistency);
  }

  void connect(
      AcquisitionDevice device, Function(bool, Exception) callback) async {
    _selectedDevice = device;
    _acquisitionDevicePersistency.clear();
    _bluetoothScanSubscription.pause();

    _connectedDeviceStream = flutterReactiveBle
        .connectToDevice(
            id: _selectedDevice.id.toString(),
            connectionTimeout: Duration(seconds: 10))
        .listen((event) {
      if (event.connectionState == DeviceConnectionState.connected) {
        setupCharacteristics();
        callback(true, null);
      } else if (event.connectionState == DeviceConnectionState.disconnected) {
        disconnect();
        callback(false, Exception("Failed to connect to device"));
      }
    });
  }

  void disconnect() async {
    if (_selectedDevice != null) {
      _selectedDevice = null;
      _connectedDeviceStream.cancel();
    }
  }

  void setupCharacteristics() async {
    _sendCharacteristic = QualifiedCharacteristic(
        characteristicId: Uuid.parse(BLE_SEND),
        serviceId: Uuid.parse(BLE_SERVICE),
        deviceId: _selectedDevice.id.toString());

    _receiveCharacteristic = QualifiedCharacteristic(
        characteristicId: Uuid.parse(BLE_RECEIVE),
        serviceId: Uuid.parse(BLE_SERVICE),
        deviceId: _selectedDevice.id.toString());
  }

  Future<Stream<List<int>>> startDataStream() async {
    await flutterReactiveBle.requestConnectionPriority(
        deviceId: _selectedDevice.id.toString(),
        priority: ConnectionPriority.highPerformance);

    flutterReactiveBle.writeCharacteristicWithoutResponse(_sendCharacteristic,
        value: startStreamChar.codeUnits);

    return flutterReactiveBle.subscribeToCharacteristic(_receiveCharacteristic);
  }

  Future<void> stopDataStream() async {
    await flutterReactiveBle.requestConnectionPriority(
        deviceId: _selectedDevice.id.toString(),
        priority: ConnectionPriority.balanced);
    flutterReactiveBle.writeCharacteristicWithoutResponse(_sendCharacteristic,
        value: stopStreamChar.codeUnits);
  }

  @override
  Stream<List<AcquisitionDevice>> watch() => streamController.stream;
}
