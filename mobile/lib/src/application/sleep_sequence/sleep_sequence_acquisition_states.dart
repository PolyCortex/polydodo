import 'package:polydodo/src/domain/sleep_sequence/signal_result.dart';

abstract class SleepSequenceAcquisitionState {}

class SleepSequenceAcquisitionInitial extends SleepSequenceAcquisitionState {}

class SleepSequenceAcquisitionTestSignalInProgress
    extends SleepSequenceAcquisitionState {
  final SignalResult fpzCzChannelResult;
  final SignalResult pzOzChannelResult;

  SleepSequenceAcquisitionTestSignalInProgress(
      this.fpzCzChannelResult, this.pzOzChannelResult);
}

class SleepSequenceAcquisitionTestSignalSuccess
    extends SleepSequenceAcquisitionState {
  final SignalResult fpzCzChannelResult;
  final SignalResult pzOzChannelResult;

  SleepSequenceAcquisitionTestSignalSuccess(
      this.fpzCzChannelResult, this.pzOzChannelResult);
}

class SleepSequenceAcquisitionTestSignalFailure
    extends SleepSequenceAcquisitionState {
  final Exception cause;

  SleepSequenceAcquisitionTestSignalFailure(this.cause);
}

class SleepSequenceAcquisitionRecordInProgress
    extends SleepSequenceAcquisitionState {}

class SleepSequenceAcquisitionRecordSuccess
    extends SleepSequenceAcquisitionState {}

class SleepSequenceAcquisitionRecordFailure
    extends SleepSequenceAcquisitionState {}

class SleepSequenceAcquisitionAnalyzeInProgress
    extends SleepSequenceAcquisitionState {}

class SleepSequenceAcquisitionAnalyzeSuccessful
    extends SleepSequenceAcquisitionState {}

class SleepSequenceAcquisitionAnalyzeFailure
    extends SleepSequenceAcquisitionState {}
