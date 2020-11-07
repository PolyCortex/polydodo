import 'package:polydodo/src/domain/eeg_data/signal_result.dart';

abstract class DataState {}

class DataStateInitial extends DataState {}

class DataStateRecording extends DataState {}

class DataStateTestSignalInProgress extends DataState {}

class DataStateTestSignalSuccess extends DataState {
  final SignalResult channelOneResult;
  final SignalResult channelTwoResult;

  DataStateTestSignalSuccess(this.channelOneResult, this.channelTwoResult);
}

class DataStateTestSignalFailure extends DataState {
  final Exception cause;

  DataStateTestSignalFailure(this.cause);
}
