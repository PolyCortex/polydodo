import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'device_selector_state.dart';

class DeviceSelectorCubit extends Cubit<DeviceState> {
  final IAcquisitionDeviceRepository _deviceRepository;

  StreamSubscription<List<AcquisitionDevice>> _acquisitionDeviceStream;

  DeviceSelectorCubit(this._deviceRepository) : super(DeviceInitial()) {
    startSearching();
  }

  void startSearching() {
    _deviceRepository.initializeBluetooth();

    if (_acquisitionDeviceStream == null) {
      _acquisitionDeviceStream = _deviceRepository
          .watch()
          .asBroadcastStream()
          .listen((devices) => emit(DeviceSearchInProgress(devices)),
              onError: (e) => emit(DeviceSearchFailure(e)));
    }
  }

  void connect(AcquisitionDevice device) async {
    emit(DeviceConnectionInProgress());

    _deviceRepository.connect(device).then(
        (value) => {
              _acquisitionDeviceStream.cancel(),
              emit(DeviceConnectionSuccess())
            },
        onError: (e) => {emit(DeviceConnectionFailure(e)), resetSearch()});
  }

  void resetSearch() {
    _deviceRepository.disconnect();
    startSearching();
  }
}
