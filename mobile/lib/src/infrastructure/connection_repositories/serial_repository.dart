import 'dart:async';
import 'dart:typed_data';

import 'package:polydodo/src/domain/acquisition_device/device_type.dart';
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
  StreamSubscription _usbEventSubscription;
  final Map _serialDevices = <String, UsbDevice>{};
  final streamController = StreamController<AcquisitionDevice>();

  @override
  Stream<AcquisitionDevice> scan() {
    _serialDevices.clear();
    _usbEventSubscription ??= UsbSerial.usbEventStream.listen((event) {
      if (event.event == UsbEvent.ACTION_USB_ATTACHED) {
        _addDevices([event.device]);
      }
    });

    UsbSerial.listDevices().then((devices) => _addDevices(devices));

    return streamController.stream;
  }

  @override
  void pauseScan() {}

  void _addDevices(List<UsbDevice> serialDevices) {
    for (var serialDevice in serialDevices) {
      if (_serialDevices.containsKey(serialDevice.deviceId.toString())) {
        continue;
      }

      var device = AcquisitionDevice(
          UniqueId.from(serialDevice.deviceId.toString()),
          serialDevice.productName,
          DeviceType.serial);

      streamController.add(device);

      _serialDevices[serialDevice.deviceId.toString()] = serialDevice;
    }
  }

  @override
  Future<void> connect(
      AcquisitionDevice device, Function(bool, Exception) callback) async {
    _selectedDevice = _serialDevices[device.id.toString()];
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
}
