import 'night_stats.dart';

abstract class ISleepHistoryRepository {
  void initializeRepository();

  void selectNight(NightStats stat);

  Stream<NightStats> getSelectedNight();

  Stream<List<NightStats>> watch();
}
