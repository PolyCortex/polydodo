import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';

abstract class SleepSequenceMetricsState {}

class SleepSequenceMetricsInitial extends SleepSequenceMetricsState {}

class SleepSequenceMetricsLoaded extends SleepSequenceMetricsState {
  final SleepSequence sleepSequence;

  SleepSequenceMetricsLoaded(this.sleepSequence);
}
