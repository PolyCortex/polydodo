import 'night_stats.dart';

abstract class ISleepHistoryRepository {
  void initializeRepository();

  void viewNight(NightStats stat);

  Stream<NightStats> getSelectedNight();

  void deleteNights(List<NightStats> nights);

  Stream<List<NightStats>> watch();
}
