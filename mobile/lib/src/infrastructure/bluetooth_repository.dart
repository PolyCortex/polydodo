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

  BluetoothDevice selectedDevice;
  BluetoothCharacteristic sendCharacteristic;
  BluetoothCharacteristic receiveCharacteristic;

  FlutterBlue flutterBlue;
  StreamSubscription<List<ScanResult>> _bluetoothScanSubscription;
  List<AcquisitionDevice> bluetoothPersistency = [];
  final streamController = StreamController<List<AcquisitionDevice>>();

  BluetoothRepository(this.flutterBlue);

  void initializeBluetooth() {
    if (_bluetoothScanSubscription == null) {
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
        UniqueId.from(bluetoothDevice.id.toString()),
        bluetoothDevice.name,
        bluetoothDevice);
    final idx = bluetoothPersistency.indexOf(device);
    idx == -1
        ? bluetoothPersistency.add(device)
        : bluetoothPersistency[idx] = device;
    streamController.add(bluetoothPersistency);
  }

  Future<void> connect(AcquisitionDevice device) async {
    selectedDevice = device.interface;

    bluetoothPersistency.clear();
    _bluetoothScanSubscription.pause();
    flutterBlue.stopScan();

    try {
      await device.interface
          .connect()
          .then((value) => findRelevantCharacteristics())
          .timeout(Duration(seconds: 6),
              onTimeout: () =>
                  {disconnect(), throw Exception("Connection Timed out")});
    } catch (e) {
      print(e);
      if (e is PlatformException) {
        if (e.code != "already_connected") throw Exception(e.details);
      } else
        throw e;
    }

    return;
  }

  void disconnect() async {
    if (selectedDevice != null) {
      await selectedDevice.disconnect();
      selectedDevice = null;
    }
  }

  void findRelevantCharacteristics() {
    selectedDevice.discoverServices().then((services) => {
          for (BluetoothCharacteristic characteristic in (services.where(
                  (service) => service.uuid.toString().contains(BLE_SERVICE)))
              .first
              .characteristics)
            {
              if (characteristic.uuid.toString().contains(BLE_RECEIVE))
                {receiveCharacteristic = characteristic}
              else if (characteristic.uuid.toString().contains(BLE_SEND))
                {sendCharacteristic = characteristic}
            },
          if (receiveCharacteristic == null)
            throw Exception('Device is missing receive Characteristic'),
          if (sendCharacteristic == null)
            throw Exception('Device is missing send Characteristic')
        });
  }

  Future<Stream<List<int>>> startDataStream() async {
    await receiveCharacteristic.setNotifyValue(true);

    await sendCharacteristic.write(startStreamChar.codeUnits);
    return receiveCharacteristic.value;
  }

  void stopDataStream() async {
    await receiveCharacteristic.setNotifyValue(false);
    await sendCharacteristic.write(stopStreamChar.codeUnits);
  }

  @override
  Stream<List<AcquisitionDevice>> watch() => streamController.stream;
}
