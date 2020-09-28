import 'package:polydodo/src/domain/domain.dart';

import 'data_states.dart';
import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class DataCubit extends Cubit<DataState> {
  final IBluetoothRepository _bluetoothRepository;
  final IEEGDataRepository _eegDataRepository;

  DataCubit(this._bluetoothRepository, this._eegDataRepository)
      : super(DataStateInitial());

  void startStreaming() {
    emit(DataStateRecording());
    _bluetoothRepository
        .startDataStream()
        .then((stream) => _eegDataRepository.createRecordingFromStream(stream));
  }

  void stopStreaming() {
    emit(DataStateInitial());
    _bluetoothRepository.stopDataStream();
    _eegDataRepository.stopRecordingFromStream();
  }
}
