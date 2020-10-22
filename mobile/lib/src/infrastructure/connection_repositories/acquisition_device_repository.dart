import 'dart:async';

import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/bluetooth_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/serial_repository.dart';
import 'package:streaming_shared_preferences/streaming_shared_preferences.dart';

class AcquisitionDeviceRepository implements IAcquisitionDeviceRepository {
  final BluetoothRepository _bluetoothRepository = new BluetoothRepository();
  final SerialRepository _serialRepository = new SerialRepository();
  IAcquisitionDeviceRepository _currentRepository;

  StreamSubscription _bluetoothStream;
  StreamSubscription _serialStream;
  StreamSubscription _currentStream;

  StreamController<List<AcquisitionDevice>> _acquisitionDeviceController;
  StreamingSharedPreferences _preferences;

  AcquisitionDeviceRepository() {
    _currentRepository = _serialRepository;
    _acquisitionDeviceController = new StreamController();
  }

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

  void connect(AcquisitionDevice device, Function(bool, Exception) callback) {
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

  Stream<List<AcquisitionDevice>> watch() {
    return _acquisitionDeviceController.stream;
  }
}
