import 'dart:async';

import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/device_type.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/bluetooth_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/serial_repository.dart';

class AcquisitionDeviceRepository implements IAcquisitionDeviceRepository {
  final BluetoothRepository _bluetoothRepository = BluetoothRepository();
  final SerialRepository _serialRepository = SerialRepository();
  final List<AcquisitionDevice> _acquisitionDevicePersistency = [];

  IAcquisitionDeviceRepository _currentRepository;

  StreamSubscription _bluetoothStream;
  StreamSubscription _serialStream;
  StreamController<List<AcquisitionDevice>> _acquisitionDeviceController;

  AcquisitionDeviceRepository() {
    _currentRepository = _serialRepository;
    _acquisitionDeviceController = StreamController();
  }

  @override
  Future<void> initializeRepository() async {
    _acquisitionDevicePersistency.clear();
    _bluetoothRepository.initializeRepository();
    _serialRepository.initializeRepository();

    _serialStream ??= _serialRepository.watch().listen((event) {
      _addDevices(event);
    });
    _bluetoothStream ??= _bluetoothRepository.watch().listen((event) {
      _addDevices(event);
    });
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

  @override
  Stream<List<AcquisitionDevice>> watch() {
    return _acquisitionDeviceController.stream;
  }

  void _addDevices(List<AcquisitionDevice> devices) {
    for (var device in devices) {
      if (!_acquisitionDevicePersistency.contains(device)) {
        _acquisitionDevicePersistency.add(device);
      }
    }
    _acquisitionDeviceController.add(_acquisitionDevicePersistency);
  }
}
