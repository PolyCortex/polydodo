import 'package:polydodo/src/domain/sleep_history/night_stats.dart';

abstract class SleepHistoryState {}

class SleepHistoryInitial extends SleepHistoryState {}

class SleepHistoryLoaded extends SleepHistoryState {
  final List<NightStats> history;
  final List<NightStats> selectedNights;

  SleepHistoryLoaded(this.history, this.selectedNights);
}
