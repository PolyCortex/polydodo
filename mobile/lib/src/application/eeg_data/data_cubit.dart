import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/domain/eeg_data/i_eeg_data_repository.dart';

import 'data_states.dart';
import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class DataCubit extends Cubit<DataState> {
  final IAcquisitionDeviceRepository _deviceRepository;
  final IEEGDataRepository _eegDataRepository;

  DataCubit(this._deviceRepository, this._eegDataRepository)
      : super(DataStateInitial());

  void startStreaming() {
    emit(DataStateRecording());
    _deviceRepository
        .startDataStream()
        .then((stream) => _eegDataRepository.createRecordingFromStream(stream));
  }

  void stopStreaming() {
    emit(DataStateInitial());
    _deviceRepository.stopDataStream();
    _eegDataRepository.stopRecordingFromStream();
  }
}
