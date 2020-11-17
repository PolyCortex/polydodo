import 'dart:async';

import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';
import 'package:polydodo/src/infrastructure/sleep_history/mock_data.dart';

class MockSleepSequenceRepository implements ISleepSequenceRepository {
  final List<SleepSequenceStats> _sleepSequencesPersistency = [];
  final sequenceStreamController = StreamController<SleepSequenceStats>();

  MockSleepSequenceRepository() {
    _sleepSequencesPersistency.add(mock_data_1);

    _sleepSequencesPersistency.add(mock_data_2);
  }

  @override
  List<SleepSequenceStats> getSleepSequences() => _sleepSequencesPersistency;

  @override
  void addSleepSequence(SleepSequenceStats sequence) {
    _sleepSequencesPersistency.add(sequence);
  }

  @override
  void deleteSleepSequences(List<SleepSequenceStats> sequences) {
    for (var sequence in sequences) {
      _sleepSequencesPersistency.remove(sequence);
    }
  }
}
