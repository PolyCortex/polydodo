import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';

abstract class SleepSequenceStatsState {}

class SleepSequenceStatsInitial extends SleepSequenceStatsState {}

class SleepSequenceStatsLoaded extends SleepSequenceStatsState {
  final SleepSequenceStats stats;

  SleepSequenceStatsLoaded(this.stats);
}
