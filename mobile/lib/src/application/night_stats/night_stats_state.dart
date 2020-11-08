import 'package:polydodo/src/domain/sleep_history/night_stats.dart';

abstract class NightStatsState {}

class NightStatsStateInitial extends NightStatsState {}

class NightStatsLoaded extends NightStatsState {
  final NightStats stats;

  NightStatsLoaded(this.stats);
}
