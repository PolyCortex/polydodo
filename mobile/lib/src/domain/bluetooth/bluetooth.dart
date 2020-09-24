import 'package:flutter_blue/flutter_blue.dart';

class Bluetooth {
  static const String BLE_SERVICE = "fe84";
  static const String BLE_RECEIVE = "2d30c082";
  static const String BLE_SEND = "2d30c083";

  String id;
  String name;
  BluetoothDevice device;
  BluetoothCharacteristic sendCharacteristic;
  BluetoothCharacteristic receiveCharacteristic;

  Bluetooth(this.device) : assert(device != null) {
    this.id = this.device.id.toString();
    this.name = this.device.name;
  }

  BluetoothCharacteristic get send {
    if (sendCharacteristic == null)
      throw Exception('Proper Ganglion Send characteristic was not found');
    return sendCharacteristic;
  }

  void setSendCharacteristic(BluetoothCharacteristic s) {
    sendCharacteristic = s;
  }

  BluetoothCharacteristic get receive {
    if (receiveCharacteristic == null)
      throw Exception('Proper Ganglion Receive characteristic was not found');
    return receiveCharacteristic;
  }

  void setReceiveCharacteristic(BluetoothCharacteristic r) {
    receiveCharacteristic = r;
  }
}
