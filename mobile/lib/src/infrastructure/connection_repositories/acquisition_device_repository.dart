import 'dart:async';

import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/bluetooth_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/serial_repository.dart';
import 'package:streaming_shared_preferences/streaming_shared_preferences.dart';

class AcquisitionDeviceRepository implements IAcquisitionDeviceRepository {
  final BluetoothRepository _bluetoothRepository = BluetoothRepository();
  final SerialRepository _serialRepository = SerialRepository();
  IAcquisitionDeviceRepository _currentRepository;

  StreamSubscription _bluetoothStream;
  StreamSubscription _serialStream;
  StreamSubscription _currentStream;

  StreamController<List<AcquisitionDevice>> _acquisitionDeviceController;
  StreamingSharedPreferences _preferences;

  AcquisitionDeviceRepository() {
    _currentRepository = _serialRepository;
    _acquisitionDeviceController = StreamController();
  }

  @override
  Future<void> initializeRepository() async {
    if (_preferences == null) {
      _preferences = await StreamingSharedPreferences.instance;
      _preferences
          .getBool('using_bluetooth', defaultValue: false)
          .listen((usingBluetooth) {
        disconnect();
        _currentStream.pause();
        _currentRepository =
            usingBluetooth ? _bluetoothRepository : _serialRepository;
        _currentRepository.initializeRepository();
        _currentStream = usingBluetooth ? _bluetoothStream : _serialStream;
        _currentStream.resume();
      });

      _serialStream = _serialRepository.watch().listen((event) {
        _acquisitionDeviceController.add(event);
      });
      _bluetoothStream = _bluetoothRepository.watch().listen((event) {
        _acquisitionDeviceController.add(event);
      });

      _currentStream = _bluetoothStream;
      _serialStream.pause();
    }
  }

  @override
  void connect(AcquisitionDevice device, Function(bool, Exception) callback) {
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
}
