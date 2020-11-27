import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';

abstract class SleepSequenceStatsState {}

class SleepSequenceStatsInitial extends SleepSequenceStatsState {}

class SleepSequenceStatsLoaded extends SleepSequenceStatsState {
  final SleepSequence sequence;

  SleepSequenceStatsLoaded(this.sequence);
}
