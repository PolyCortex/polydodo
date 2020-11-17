import 'dart:async';

import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/device_type.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/domain/acquisition_device/i_device_locator_service.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/bluetooth_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/serial_repository.dart';

class DeviceLocatorService implements IDeviceLocatorService {
  final BluetoothRepository _bluetoothRepository = BluetoothRepository();
  final SerialRepository _serialRepository = SerialRepository();

  IAcquisitionDeviceRepository _currentRepository;

  StreamSubscription _serialStreamSubscription;
  StreamSubscription _bluetoothStreamSubscription;
  StreamController<List<AcquisitionDevice>> _acquisitionDeviceController;

  DeviceLocatorService() {
    _currentRepository = _serialRepository;
    _acquisitionDeviceController = StreamController();
  }

  @override
  Stream<List<AcquisitionDevice>> scan() {
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

  @override
  void connect(AcquisitionDevice device, Function(bool, Exception) callback) {
    _bluetoothRepository.pauseScan();

    _currentRepository = (device.deviceType == DeviceType.bluetooth)
        ? _bluetoothRepository
        : _serialRepository;

    _currentRepository.connect(device, callback);
  }

  @override
  void disconnect() {
    _currentRepository.disconnect();
  }

  @override
  Future<Stream<List<int>>> startDataStream() {
    return _currentRepository.startDataStream();
  }

  @override
  void stopDataStream() {
    _currentRepository.stopDataStream();
  }
}
