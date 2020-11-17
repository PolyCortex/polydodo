import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/i_device_locator_service.dart';
import 'device_selector_state.dart';

class DeviceSelectorCubit extends Cubit<DeviceState> {
  final IDeviceLocatorService _deviceLocatorService;
  final List<AcquisitionDevice> _acquisitionDevicePersistency = [];

  Stream _deviceLocatorStream;
  StreamSubscription<List<AcquisitionDevice>> _deviceLocatorStreamSubscription;

  DeviceSelectorCubit(this._deviceLocatorService) : super(DeviceInitial()) {
    startSearching();
  }

  void startSearching() {
    _deviceLocatorStream = _deviceLocatorService.scan();

    _deviceLocatorStreamSubscription ??= _deviceLocatorStream.listen((devices) {
      _addDevices(devices);
    });
  }

  Future<void> connect(AcquisitionDevice device) async {
    emit(DeviceConnectionInProgress());

    _deviceLocatorService.connect(device, connectionCallback);
  }

  void connectionCallback(bool connected, [Exception e]) {
    if (e != null) {
      emit(DeviceConnectionFailure(e));
      resetSearch();
    } else if (connected) {
      _deviceLocatorStreamSubscription.cancel();
      emit(DeviceConnectionSuccess());
    }
  }

  void resetSearch() {
    _deviceLocatorService.disconnect();
    startSearching();
  }

  void _addDevices(List<AcquisitionDevice> devices) {
    for (var device in devices) {
      var idx = _acquisitionDevicePersistency.indexOf(device);

      if (idx == -1) {
        _acquisitionDevicePersistency.add(device);
      } else {
        _acquisitionDevicePersistency[idx] = device;
      }
    }

    emit(DeviceSearchInProgress(_acquisitionDevicePersistency));
  }
}
