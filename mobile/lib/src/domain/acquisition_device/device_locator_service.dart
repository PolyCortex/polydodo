import 'dart:async';

import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/device_type.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/bluetooth_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/serial_repository.dart';

class DeviceLocatorService {
  final BluetoothRepository _bluetoothRepository;
  final SerialRepository _serialRepository;

  IAcquisitionDeviceRepository _currentRepository;

  StreamSubscription _serialStreamSubscription;
  StreamSubscription _bluetoothStreamSubscription;
  StreamController<AcquisitionDevice> _acquisitionDeviceController;

  DeviceLocatorService(this._bluetoothRepository, this._serialRepository) {
    _currentRepository = _serialRepository;
    _acquisitionDeviceController = StreamController();
  }

  Stream<AcquisitionDevice> scan() {
    var bluetoothStream = _bluetoothRepository.scan();
    var serialStream = _serialRepository.scan();

    _serialStreamSubscription ??= bluetoothStream.listen((event) {
      _acquisitionDeviceController.add(event);
    });
    _bluetoothStreamSubscription ??= serialStream.listen((event) {
      _acquisitionDeviceController.add(event);
    });

    return _acquisitionDeviceController.stream;
  }

  void connect(AcquisitionDevice device, Function(bool, Exception) callback) {
    _bluetoothRepository.pauseScan();

    _currentRepository = (device.deviceType == DeviceType.bluetooth)
        ? _bluetoothRepository
        : _serialRepository;

    _currentRepository.connect(device, callback);
  }

  void disconnect() {
    _currentRepository.disconnect();
  }

  Future<Stream<List<int>>> startDataStream() {
    return _currentRepository.startDataStream();
  }

  void stopDataStream() {
    _currentRepository.stopDataStream();
  }
}
