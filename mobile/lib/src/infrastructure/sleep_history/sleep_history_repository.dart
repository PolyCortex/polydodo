import 'dart:async';

import 'package:polydodo/src/domain/sleep_history/i_sleep_history_repository.dart';
import 'package:polydodo/src/domain/sleep_history/night_stats.dart';
import 'package:polydodo/src/domain/unique_id.dart';

class SleepHistoryRepository implements ISleepHistoryRepository {
  final List<NightStats> _sleepHistoryPersistency = [];
  final streamController = StreamController<List<NightStats>>();
  final nightStreamController = StreamController<NightStats>();

  SleepHistoryRepository();

  @override
  void initializeRepository() {
    _sleepHistoryPersistency.add(NightStats(
        id: UniqueId.from('test'),
        awakenings: 3,
        effectiveSleepTime: DateTime.now(),
        numberTransitions: 5,
        recordingStart: DateTime.now(),
        recordingEnd: DateTime.now(),
        remLatency: 20,
        sleepEfficiency: 20.0,
        sleepLatency: 10,
        waso: DateTime.now()));

    _sleepHistoryPersistency.add(NightStats(
        id: UniqueId.from('test2'),
        awakenings: 100,
        effectiveSleepTime: DateTime.now(),
        numberTransitions: 5,
        recordingStart: DateTime.now(),
        recordingEnd: DateTime.now(),
        remLatency: 20,
        sleepEfficiency: 20.0,
        sleepLatency: 10,
        waso: DateTime.now()));

    streamController.add(_sleepHistoryPersistency);
  }

  @override
  void selectNight(NightStats stat) {
    nightStreamController.add(stat);
  }

  @override
  Stream<NightStats> getSelectedNight() => nightStreamController.stream;

  @override
  Stream<List<NightStats>> watch() {
    return streamController.stream;
  }
}
