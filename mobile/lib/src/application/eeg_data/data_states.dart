import 'package:polydodo/src/domain/eeg_data/signal_result.dart';

abstract class DataState {}

class DataStateInitial extends DataState {}

class DataStateTestSignalInProgress extends DataState {
  final SignalResult fpzCzChannelResult;
  final SignalResult pzOzChannelResult;

  DataStateTestSignalInProgress(
      this.fpzCzChannelResult, this.pzOzChannelResult);
}

class DataStateTestSignalSuccess extends DataState {
  final SignalResult fpzCzChannelResult;
  final SignalResult pzOzChannelResult;

  DataStateTestSignalSuccess(this.fpzCzChannelResult, this.pzOzChannelResult);
}

class DataStateTestSignalFailure extends DataState {
  final Exception cause;

  DataStateTestSignalFailure(this.cause);
}

class DataStateRecordInProgress extends DataState {}

class DataStateAnalyzeInProgress extends DataState {}

class DataStateAnalyzeSuccessful extends DataState {}
