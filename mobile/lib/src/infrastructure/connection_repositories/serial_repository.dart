import 'dart:async';
import 'dart:typed_data';

import 'package:polydodo/src/domain/unique_id.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/infrastructure/constants.dart';
import 'package:usb_serial/usb_serial.dart';

class SerialRepository implements IAcquisitionDeviceRepository {
  UsbDevice _selectedDevice;
  UsbPort _serialPort;
  List<AcquisitionDevice> _acquisitionDevicePersistency = [];
  List<UsbDevice> _serialDevices = [];
  final streamController = StreamController<List<AcquisitionDevice>>();

  void initializeRepository() {
    _acquisitionDevicePersistency.clear();
    _serialDevices.clear();
    UsbSerial.listDevices().then((devices) => addDevices(devices));
  }

  void addDevices(List<UsbDevice> serialDevices) {
    for (UsbDevice serialDevice in serialDevices) {
      AcquisitionDevice device = AcquisitionDevice(
          UniqueId.from(serialDevice.deviceId.toString()),
          serialDevice.productName);

      _acquisitionDevicePersistency.add(device);
      _serialDevices.add(serialDevice);
    }
    streamController.add(_acquisitionDevicePersistency);
  }

  Future<void> connect(
      AcquisitionDevice device, Function(bool, Exception) callback) async {
    _selectedDevice =
        _serialDevices[_acquisitionDevicePersistency.indexOf(device)];
    _serialPort = await _selectedDevice.create();
    bool openSuccessful = await _serialPort.open();

    if (!openSuccessful) {
      callback(false, Exception("Could not open port"));
    }

    _serialPort.setPortParameters(
        115200, UsbPort.DATABITS_8, UsbPort.STOPBITS_1, UsbPort.PARITY_NONE);

    callback(true, null);
  }

  Future<void> disconnect() async {
    await _serialPort?.close();
    _selectedDevice = null;
    _serialPort = null;
  }

  Future<Stream<List<int>>> startDataStream() async {
    _serialPort.write(Uint8List.fromList(START_STREAM_CHAR.codeUnits));

    return _serialPort.inputStream;
  }

  Future<void> stopDataStream() async {
    await _serialPort.write(Uint8List.fromList(STOP_STREAM_CHAR.codeUnits));
  }

  Stream<List<AcquisitionDevice>> watch() => streamController.stream;
}
