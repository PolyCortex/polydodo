import 'dart:async';

import 'package:flutter_blue/flutter_blue.dart';
import 'package:polydodo/src/domain/bluetooth/i_bluetooth_repository.dart';
import 'package:polydodo/src/domain/bluetooth/bluetooth.dart';

class BluetoothRepository implements IBluetoothRepository {
  Bluetooth selectedDevice;
  static List<Bluetooth> bluetoothPersistency = [];
  final streamController = StreamController<List<Bluetooth>>();

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

  @override
  Future<void> addDevice(BluetoothDevice device) async {
    await Future.delayed(Duration(milliseconds: 400));
    Bluetooth d = new Bluetooth(device);
    final idx = bluetoothPersistency.indexOf(d);
    idx == -1 ? bluetoothPersistency.add(d) : bluetoothPersistency[idx] = d;
    streamController.add(bluetoothPersistency);
  }

  Future<void> connect(Bluetooth bluetoothDevice) async {
    await bluetoothDevice.device.connect().then((value) =>
        {selectedDevice = bluetoothDevice, findRelevantCharacteristics()});
    return;
  }

  void disconnect() async {
    await selectedDevice.device.disconnect();
  }

  void findRelevantCharacteristics() {
    selectedDevice.device.discoverServices().then((services) => {
          for (BluetoothService service in services)
            {
              print("Found Service"),
              if (service.toString().contains(Bluetooth.BLE_SERVICE))
                {
                  for (BluetoothCharacteristic characteristic
                      in service.characteristics)
                    {
                      if (characteristic
                          .toString()
                          .contains(Bluetooth.BLE_RECEIVE))
                        {
                          print("Found receive"),
                          selectedDevice
                              .setReceiveCharacteristic(characteristic)
                        }
                      else if (characteristic
                          .toString()
                          .contains(Bluetooth.BLE_SEND))
                        {
                          print("Found send"),
                          selectedDevice
                              .setSendCharacteristic(characteristic)
                        }
                    }
                }
            }
        });
  }

  Future<Stream<List<int>>> startDataStream() async {
    print(selectedDevice.receive);
    print("haha");
    print(selectedDevice.send);
    await selectedDevice.receive.setNotifyValue(true);

    String b = 'b';
    await selectedDevice.send.write(b.codeUnits);
    return selectedDevice.receive.value;
  }

  void stopDataStream() async {
    String s = 's';
    await selectedDevice.receive.setNotifyValue(false);
    await selectedDevice.send.write(s.codeUnits);
  }

  @override
  Stream<List<Bluetooth>> watch() => streamController.stream;
}
