import 'dart:async';

import 'package:flutter_reactive_ble/flutter_reactive_ble.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/device_type.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/infrastructure/constants.dart';
import 'package:polydodo/src/domain/unique_id.dart';
import 'package:pedantic/pedantic.dart';

class BluetoothRepository implements IAcquisitionDeviceRepository {
  static const String BLE_SERVICE = '0000fe84-0000-1000-8000-00805f9b34fb';
  static const String BLE_RECEIVE = '2d30c082-f39f-4ce6-923f-3484ea480596';
  static const String BLE_SEND = '2d30c083-f39f-4ce6-923f-3484ea480596';

  AcquisitionDevice _selectedDevice;
  QualifiedCharacteristic _sendCharacteristic;
  QualifiedCharacteristic _receiveCharacteristic;

  FlutterReactiveBle flutterReactiveBle;
  StreamSubscription<ConnectionStateUpdate> _connectedDeviceStream;
  StreamSubscription<DiscoveredDevice> _bluetoothScanSubscription;
  final List<AcquisitionDevice> _acquisitionDevicePersistency = [];
  final streamController = StreamController<List<AcquisitionDevice>>();

  @override
  Stream<List<AcquisitionDevice>> scan() {
    if (_bluetoothScanSubscription == null) {
      _initScan();
    } else {
      _acquisitionDevicePersistency.clear();
      resumeScan();
    }

    return streamController.stream;
  }

  void addDevice(DiscoveredDevice bluetoothDevice) {
    var device = AcquisitionDevice(
        UniqueId.from(bluetoothDevice.id),
        (bluetoothDevice.name.isEmpty) ? 'Unknown' : bluetoothDevice.name,
        DeviceType.bluetooth);

    final idx = _acquisitionDevicePersistency.indexOf(device);

    if (idx == -1) {
      _acquisitionDevicePersistency.add(device);
    } else {
      _acquisitionDevicePersistency[idx] = device;
    }

    streamController.add(_acquisitionDevicePersistency);
  }

  void _initScan() {
    flutterReactiveBle = FlutterReactiveBle();

    _bluetoothScanSubscription = flutterReactiveBle
        .scanForDevices(withServices: []).listen((device) => addDevice(device));
  }

  void pauseScan() {
    _bluetoothScanSubscription.pause();
  }

  void resumeScan() {
    _bluetoothScanSubscription.resume();
  }

  @override
  void connect(
      AcquisitionDevice device, Function(bool, [Exception]) callback) async {
    _selectedDevice = device;
    _acquisitionDevicePersistency.clear();
    pauseScan();

    _connectedDeviceStream = flutterReactiveBle
        .connectToDevice(
            id: _selectedDevice.id.toString(),
            connectionTimeout: Duration(seconds: 10))
        .listen((event) {
      if (event.connectionState == DeviceConnectionState.connected) {
        setupCharacteristics();
        callback(true);
      } else if (event.connectionState == DeviceConnectionState.disconnected) {
        disconnect();
        callback(false, Exception('Failed to connect to device'));
      }
    });
  }

  @override
  Future<void> disconnect() async {
    _selectedDevice = null;
    await _connectedDeviceStream?.cancel();
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

  @override
  Future<Stream<List<int>>> startDataStream() async {
    await flutterReactiveBle.requestConnectionPriority(
        deviceId: _selectedDevice.id.toString(),
        priority: ConnectionPriority.highPerformance);

    unawaited(flutterReactiveBle.writeCharacteristicWithoutResponse(
        _sendCharacteristic,
        value: START_STREAM_CHAR.codeUnits));

    return flutterReactiveBle.subscribeToCharacteristic(_receiveCharacteristic);
  }

  @override
  Future<void> stopDataStream() async {
    await flutterReactiveBle.requestConnectionPriority(
        deviceId: _selectedDevice.id.toString(),
        priority: ConnectionPriority.balanced);
    unawaited(flutterReactiveBle.writeCharacteristicWithoutResponse(
        _sendCharacteristic,
        value: STOP_STREAM_CHAR.codeUnits));
  }
}
