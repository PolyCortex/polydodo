import 'dart:async';

import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';
import 'package:polydodo/src/infrastructure/sleep_history/mock_data.dart';

class SleepHistoryRepository implements ISleepSequenceRepository {
  final List<SleepSequenceStats> _sleepHistoryPersistency = [];
  final sequenceStreamController = StreamController<SleepSequenceStats>();

  SleepHistoryRepository() {
    _sleepHistoryPersistency.add(mock_data_1);

    _sleepHistoryPersistency.add(mock_data_2);
  }

  @override
  void selectSleepSequence(SleepSequenceStats sequence) {
    sequenceStreamController.add(sequence);
  }

  @override
  List<SleepSequenceStats> getSleepSequences() => _sleepHistoryPersistency;

  @override
  Stream<SleepSequenceStats> getSelectedSleepSequence() =>
      sequenceStreamController.stream;

  @override
  void deleteSleepSequences(List<SleepSequenceStats> sequences) {
    for (var sequence in sequences) {
      _sleepHistoryPersistency.remove(sequence);
    }
  }
}
