import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';

abstract class ISleepSequenceRepository {
  void selectSleepSequence(SleepSequenceStats sequence);

  List<SleepSequenceStats> getSleepSequences();
  Stream<SleepSequenceStats> getSelectedSleepSequence();

  void deleteSleepSequences(List<SleepSequenceStats> sequence);
}
