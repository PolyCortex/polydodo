import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';

abstract class ISleepSequenceRepository {
  List<SleepSequenceStats> getSleepSequences();

  void store(List<SleepSequenceStats> sequence);

  void delete(List<SleepSequenceStats> sequences,
      List<SleepSequenceStats> sequencesToDelete);
}
