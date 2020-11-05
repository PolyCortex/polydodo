import 'dart:async';

import 'package:polydodo/src/domain/sleep_history/i_sleep_history_repository.dart';
import 'package:polydodo/src/domain/sleep_history/night_stats.dart';
import 'package:polydodo/src/infrastructure/sleep_history/mock_data.dart';

class SleepHistoryRepository implements ISleepHistoryRepository {
  final List<NightStats> _sleepHistoryPersistency = [];
  final streamController = StreamController<List<NightStats>>();
  final nightStreamController = StreamController<NightStats>();

  SleepHistoryRepository();

  @override
  void initializeRepository() {
    _sleepHistoryPersistency.add(mock_data_1);

    _sleepHistoryPersistency.add(mock_data_2);

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
