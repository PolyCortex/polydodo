import 'dart:async';

import 'package:flutter/services.dart';
import 'package:flutter_blue/flutter_blue.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/domain/unique_id.dart';

class BluetoothRepository implements IAcquisitionDeviceRepository {
  static const String BLE_SERVICE = "fe84";
  static const String BLE_RECEIVE = "2d30c082";
  static const String BLE_SEND = "2d30c083";
  static const startStreamChar = 'b';
  static const stopStreamChar = 's';

  BluetoothDevice _selectedDevice;
  BluetoothCharacteristic _sendCharacteristic;
  BluetoothCharacteristic _receiveCharacteristic;

  FlutterBlue flutterBlue;
  StreamSubscription<List<ScanResult>> _bluetoothScanSubscription;
  List<AcquisitionDevice> _acquisitionDevicePersistency = [];
  List<BluetoothDevice> _bluetoothDevices = [];
  final streamController = StreamController<List<AcquisitionDevice>>();

  BluetoothRepository();

  void initializeRepository() {
    if (_bluetoothScanSubscription == null) {
      flutterBlue = FlutterBlue.instance;

      flutterBlue.connectedDevices
          .asStream()
          .asBroadcastStream()
          .listen((List<BluetoothDevice> devices) {
        for (BluetoothDevice device in devices) {
          addDevice(device);
        }
      });
      _bluetoothScanSubscription =
          flutterBlue.scanResults.listen((List<ScanResult> results) {
        for (ScanResult result in results) {
          addDevice(result.device);
        }
      });
    } else {
      _bluetoothScanSubscription.resume();
    }
    flutterBlue.startScan();
  }

  void addDevice(BluetoothDevice bluetoothDevice) {
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

    _acquisitionDevicePersistency.clear();
    _bluetoothDevices.clear();
    _bluetoothScanSubscription.pause();
    flutterBlue.stopScan();

    try {
      await _selectedDevice
          .connect()
          .then((value) => findRelevantCharacteristics())
          .timeout(Duration(seconds: 6),
              onTimeout: () =>
                  {disconnect(), throw Exception("Connection Timed out")});
    } catch (e) {
      if (e is PlatformException) {
        if (e.code != "already_connected") throw Exception(e.details);
      } else
        throw e;
    }

    return;
  }

  void disconnect() async {
    if (_selectedDevice != null) {
      await _selectedDevice.disconnect();
      _selectedDevice = null;
    }
  }

  void findRelevantCharacteristics() {
    _selectedDevice.discoverServices().then((services) => {
          for (BluetoothCharacteristic characteristic in (services.where(
                  (service) => service.uuid.toString().contains(BLE_SERVICE)))
              .first
              .characteristics)
            {
              if (characteristic.uuid.toString().contains(BLE_RECEIVE))
                {_receiveCharacteristic = characteristic}
              else if (characteristic.uuid.toString().contains(BLE_SEND))
                {_sendCharacteristic = characteristic}
            },
          if (_receiveCharacteristic == null)
            throw Exception('Device is missing receive Characteristic'),
          if (_sendCharacteristic == null)
            throw Exception('Device is missing send Characteristic')
        });
  }

  Future<Stream<List<int>>> startDataStream() async {
    await _receiveCharacteristic.setNotifyValue(true);

    await _sendCharacteristic.write(startStreamChar.codeUnits);
    return _receiveCharacteristic.value;
  }

  void stopDataStream() async {
    await _receiveCharacteristic.setNotifyValue(false);
    await _sendCharacteristic.write(stopStreamChar.codeUnits);
  }

  @override
  Stream<List<AcquisitionDevice>> watch() => streamController.stream;
}
