import 'package:polydodo/src/domain/sleep_history/night_stats.dart';

abstract class SleepHistoryState {}

class SleepHistoryInitial extends SleepHistoryState {}

class SleepHistoryLoaded extends SleepHistoryState {
  final List<NightStats> history;

  SleepHistoryLoaded(this.history);
}
