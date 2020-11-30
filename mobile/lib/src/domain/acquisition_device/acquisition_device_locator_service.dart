import 'dart:async';

import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device_type.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';

class AcquisitionDeviceLocatorService {
  final IAcquisitionDeviceRepository _bluetoothRepository;
  final IAcquisitionDeviceRepository _serialRepository;

  IAcquisitionDeviceRepository _currentRepository;

  StreamSubscription _serialStreamSubscription;
  StreamSubscription _bluetoothStreamSubscription;
  StreamController<AcquisitionDevice> _acquisitionDeviceController;

  AcquisitionDeviceLocatorService(
      this._bluetoothRepository, this._serialRepository) {
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
    _currentRepository = (device.deviceType == AcquisitionDeviceType.bluetooth)
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

  AcquisitionDeviceType getCurrentDeviceType() {
    return (_currentRepository == _bluetoothRepository)
        ? AcquisitionDeviceType.bluetooth
        : AcquisitionDeviceType.serial;
  }
}
