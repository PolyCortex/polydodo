import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';

abstract class SleepSequenceHistoryState {}

class SleepSequenceHistoryInitial extends SleepSequenceHistoryState {}

class SleepSequenceHistoryLoaded extends SleepSequenceHistoryState {
  final List<SleepSequence> history;

  SleepSequenceHistoryLoaded(this.history);
}

class SleepSequenceHistoryEditInProgress extends SleepSequenceHistoryState {
  final List<SleepSequence> history;
  final List<SleepSequence> selectedSleepSequences;

  SleepSequenceHistoryEditInProgress(this.history, this.selectedSleepSequences);
}
