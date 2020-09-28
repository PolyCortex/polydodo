import 'dart:async';

import 'package:flutter_blue/flutter_blue.dart';
import 'package:polydodo/src/domain/bluetooth/i_bluetooth_repository.dart';

class BluetoothRepository implements IBluetoothRepository {
  static const String BLE_SERVICE = "fe84";
  static const String BLE_RECEIVE = "2d30c082";
  static const String BLE_SEND = "2d30c083";
  static const startStreamChar = 'b';
  static const stopStreamChar = 's';

  BluetoothDevice selectedDevice;
  BluetoothCharacteristic sendCharacteristic;
  BluetoothCharacteristic receiveCharacteristic;

  static List<BluetoothDevice> bluetoothPersistency = [];
  final streamController = StreamController<List<BluetoothDevice>>();

  void initializeBluetooth() {
    FlutterBlue flutterBlue = FlutterBlue.instance;
    flutterBlue.connectedDevices
        .asStream()
        .listen((List<BluetoothDevice> devices) {
      for (BluetoothDevice device in devices) {
        addDevice(device);
      }
    });
    flutterBlue.scanResults.listen((List<ScanResult> results) {
      for (ScanResult result in results) {
        addDevice(result.device);
      }
    });
    flutterBlue.startScan();
  }

  Future<void> addDevice(BluetoothDevice device) async {
    await Future.delayed(Duration(milliseconds: 400));
    final idx = bluetoothPersistency.indexOf(device);
    idx == -1 ? bluetoothPersistency.add(device) : bluetoothPersistency[idx] = device;
    streamController.add(bluetoothPersistency);
  }

  Future<void> connect(BluetoothDevice bluetoothDevice) async {
    await bluetoothDevice.connect().then((value) =>
        {selectedDevice = bluetoothDevice, findRelevantCharacteristics()});
    return;
  }

  void disconnect() async {
    await selectedDevice.disconnect();
  }

  void findRelevantCharacteristics() {
    selectedDevice.discoverServices().then((services) => {
          for (BluetoothService service in services)
            {
              if (service.toString().contains(BLE_SERVICE))
                {
                  for (BluetoothCharacteristic characteristic
                      in service.characteristics)
                    {
                      if (characteristic
                          .toString()
                          .contains(BLE_RECEIVE))
                        {
                          receiveCharacteristic = characteristic
                        }
                      else if (characteristic
                          .toString()
                          .contains(BLE_SEND))
                        {
                          sendCharacteristic = characteristic
                        }
                    }
                }
            }
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
  Stream<List<BluetoothDevice>> watch() => streamController.stream;
}
