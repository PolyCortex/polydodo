import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';

abstract class SleepSequenceHistoryState {}

class SleepSequenceHistoryInitial extends SleepSequenceHistoryState {}

class SleepSequenceHistoryLoaded extends SleepSequenceHistoryState {
  final List<SleepSequenceStats> history;

  SleepSequenceHistoryLoaded(this.history);
}

class SleepSequenceHistoryEditInProgress extends SleepSequenceHistoryState {
  final List<SleepSequenceStats> history;
  final List<SleepSequenceStats> selectedSequences;

  SleepSequenceHistoryEditInProgress(this.history, this.selectedSequences);
}
