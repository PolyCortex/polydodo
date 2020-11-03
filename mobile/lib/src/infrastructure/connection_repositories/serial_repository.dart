import 'dart:async';
import 'dart:typed_data';

import 'package:polydodo/src/domain/unique_id.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/infrastructure/constants.dart';
import 'package:usb_serial/usb_serial.dart';
import 'package:pedantic/pedantic.dart';

class SerialRepository implements IAcquisitionDeviceRepository {
  UsbDevice _selectedDevice;
  UsbPort _serialPort;
  StreamSubscription _inputStreamSubscription;
  final List<AcquisitionDevice> _acquisitionDevicePersistency = [];
  final List<UsbDevice> _serialDevices = [];
  final streamController = StreamController<List<AcquisitionDevice>>();

  @override
  void initializeRepository() {
    _acquisitionDevicePersistency.clear();
    _serialDevices.clear();
    UsbSerial.listDevices().then((devices) => addDevices(devices));
  }

  void addDevices(List<UsbDevice> serialDevices) {
    for (var serialDevice in serialDevices) {
      var device = AcquisitionDevice(
          UniqueId.from(serialDevice.deviceId.toString()),
          serialDevice.productName);

      _acquisitionDevicePersistency.add(device);
      _serialDevices.add(serialDevice);
    }
    streamController.add(_acquisitionDevicePersistency);
  }

  @override
  Future<void> connect(
      AcquisitionDevice device, Function(bool, Exception) callback) async {
    _selectedDevice =
        _serialDevices[_acquisitionDevicePersistency.indexOf(device)];
    _serialPort = await _selectedDevice.create();
    var openSuccessful = await _serialPort.open();

    if (!openSuccessful) {
      callback(false, Exception('Could not open port'));
    }

    await _serialPort.setPortParameters(
        115200, UsbPort.DATABITS_8, UsbPort.STOPBITS_1, UsbPort.PARITY_NONE);

    unawaited(_checkCytonConnection(callback));
  }

  Future<void> _checkCytonConnection(
      Function(bool, [Exception]) callback) async {
    var status = '';

    _inputStreamSubscription = _serialPort.inputStream.listen((event) {
      status += String.fromCharCodes(event);

      if (isFullMessage(status)) {
        _inputStreamSubscription.cancel();

        if (status == CYTON_SYSTEM_UP) {
          callback(true);
        } else {
          disconnect();
          callback(false, Exception(status));
        }
      }
    });

    await _serialPort.write(Uint8List.fromList(CYTON_GET_STATUS));
  }

  bool isFullMessage(String message) {
    return message.length > CYTON_MESSAGE_FOOTER.length &&
        message.substring(message.length - CYTON_MESSAGE_FOOTER.length) ==
            CYTON_MESSAGE_FOOTER;
  }

  @override
  Future<void> disconnect() async {
    await _serialPort?.close();
    await _inputStreamSubscription?.cancel();
    _selectedDevice = null;
    _serialPort = null;
  }

  @override
  Future<Stream<List<int>>> startDataStream() async {
    await _serialPort.write(Uint8List.fromList(START_STREAM_CHAR.codeUnits));

    return _serialPort.inputStream;
  }

  @override
  Future<void> stopDataStream() async {
    await _serialPort.write(Uint8List.fromList(STOP_STREAM_CHAR.codeUnits));
  }

  @override
  Stream<List<AcquisitionDevice>> watch() => streamController.stream;
}
