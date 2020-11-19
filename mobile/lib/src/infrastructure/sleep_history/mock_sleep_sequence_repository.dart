import 'dart:async';

import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';
import 'package:polydodo/src/infrastructure/sleep_history/mock_data.dart';

class MockSleepSequenceRepository implements ISleepSequenceRepository {
  final sequenceStreamController = StreamController<SleepSequenceStats>();
  List<SleepSequenceStats> _sleepSequencesPersistency = [];

  MockSleepSequenceRepository() {
    _sleepSequencesPersistency.add(mock_data_1);

    _sleepSequencesPersistency.add(mock_data_2);
  }

  @override
  List<SleepSequenceStats> getAll() => _sleepSequencesPersistency;

  @override
  void store(List<SleepSequenceStats> sequenceList) {
    _sleepSequencesPersistency = sequenceList;
  }

  @override
  void delete(List<SleepSequenceStats> sequences,
      List<SleepSequenceStats> sequencesToDelete) {
    for (var sequence in sequences) {
      _sleepSequencesPersistency.remove(sequence);
    }
  }
}
