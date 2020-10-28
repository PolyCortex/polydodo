import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:streaming_shared_preferences/streaming_shared_preferences.dart';
import 'device_selector_state.dart';

class DeviceSelectorCubit extends Cubit<DeviceState> {
  final IAcquisitionDeviceRepository _deviceRepository;

  StreamSubscription<List<AcquisitionDevice>> _acquisitionDeviceStream;
  // todo: remove this variable, also test that switch works correctly once UI is done
  bool usingBluetooth = true;

  DeviceSelectorCubit(this._deviceRepository) : super(DeviceInitial()) {
    startSearching();
  }

  void startSearching() {
    _deviceRepository.initializeRepository();

    if (_acquisitionDeviceStream == null) {
      _acquisitionDeviceStream = _deviceRepository
          .watch()
          .asBroadcastStream()
          .listen((devices) => emit(DeviceSearchInProgress(devices)),
              onError: (e) => emit(DeviceSearchFailure(e)));
    }
  }

  Future<void> connect(AcquisitionDevice device) async {
    emit(DeviceConnectionInProgress());

    _deviceRepository.connect(device, connectionCallback);
  }

  void connectionCallback(bool connected, [Exception e]) {
    if (e != null) {
      emit(DeviceConnectionFailure(e));
      resetSearch();
    } else if (connected) {
      _acquisitionDeviceStream.cancel();
      emit(DeviceConnectionSuccess());
    }
  }

  void resetSearch() {
    _deviceRepository.disconnect();
    startSearching();
  }

  // todo: change bluetooth preferences in the preference section of the app
  void swapBluetooth() async {
    print("swap");
    usingBluetooth = !usingBluetooth;
    StreamingSharedPreferences _prefs =
        await StreamingSharedPreferences.instance;

    _prefs.setBool('using_bluetooth', usingBluetooth);
  }
}
