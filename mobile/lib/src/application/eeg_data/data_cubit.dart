import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/domain/eeg_data/i_eeg_data_repository.dart';
import 'package:polydodo/src/domain/eeg_data/signal_result.dart';
import 'package:polydodo/src/application/eeg_data/data_states.dart';

class DataCubit extends Cubit<DataState> {
  final IAcquisitionDeviceRepository _deviceRepository;
  final IEEGDataRepository _eegDataRepository;

  DataCubit(this._deviceRepository, this._eegDataRepository)
      : super(DataStateInitial());

  Future<void> startStreaming() async {
    emit(DataStateRecording());
    _eegDataRepository.initialize();
    _eegDataRepository
        .createRecordingFromStream(await _deviceRepository.startDataStream());
  }

  void stopStreaming() {
    emit(DataStateInitial());
    _deviceRepository.stopDataStream();
    _eegDataRepository.stopRecordingFromStream();
  }

  Future<void> startSignalValidation() async {
    _eegDataRepository.initialize();
    _eegDataRepository.testSignal(
        await _deviceRepository.startDataStream(), signalCallback);

    emit(DataStateTestSignalInProgress(
        SignalResult.untested, SignalResult.untested));
  }

  void signalCallback(
      SignalResult fpzCzChannelResult, SignalResult pzOzChannelResult,
      [Exception e]) {
    if (e != null) {
      emit(DataStateTestSignalFailure(e));
    } else if (fpzCzChannelResult == SignalResult.good &&
        pzOzChannelResult == SignalResult.good) {
      _eegDataRepository.stopRecordingFromStream();
      emit(DataStateTestSignalSuccess(fpzCzChannelResult, pzOzChannelResult));
    } else {
      emit(
          DataStateTestSignalInProgress(fpzCzChannelResult, pzOzChannelResult));
    }
  }
}
