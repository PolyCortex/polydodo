import 'package:polydodo/src/domain/sleep_sequence/signal_result.dart';

abstract class SleepSequenceState {}

class SleepSequenceInitial extends SleepSequenceState {}

class SleepSequenceTestSignalInProgress extends SleepSequenceState {
  final SignalResult fpzCzChannelResult;
  final SignalResult pzOzChannelResult;

  SleepSequenceTestSignalInProgress(
      this.fpzCzChannelResult, this.pzOzChannelResult);
}

class SleepSequenceTestSignalSuccess extends SleepSequenceState {
  final SignalResult fpzCzChannelResult;
  final SignalResult pzOzChannelResult;

  SleepSequenceTestSignalSuccess(
      this.fpzCzChannelResult, this.pzOzChannelResult);
}

class SleepSequenceTestSignalFailure extends SleepSequenceState {
  final Exception cause;

  SleepSequenceTestSignalFailure(this.cause);
}

class SleepSequenceRecordInProgress extends SleepSequenceState {}

class SleepSequenceAnalyzeInProgress extends SleepSequenceState {}

class SleepSequenceAnalyzeSuccessful extends SleepSequenceState {}
