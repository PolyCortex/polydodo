import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';

abstract class ISleepSequenceRepository {
  List<SleepSequenceStats> getSleepSequences();

  void addSleepSequence(SleepSequenceStats sequence);

  void deleteSleepSequences(List<SleepSequenceStats> sequence);
}
