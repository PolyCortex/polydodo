import 'package:hive/hive.dart';

import 'analysis_state.dart';

part 'hive_sleep_sequence_stats.g.dart'; // Name of the TypeAdapter that we will generate in the future

@HiveType(typeId: 1)
class HiveSleepSequenceStats {
  @HiveField(0)
  String uniqueId;

  @HiveField(1)
  AnalysisState analysisState;

  @HiveField(2)
  DateTime recordingStart;

  @HiveField(3)
  DateTime recordingEnd;

  @HiveField(4)
  int effectiveSleepTimeInSeconds;

  @HiveField(5)
  double sleepEfficiency;

  @HiveField(6)
  int sleepLatency;

  @HiveField(7)
  int wasoInSeconds;

  @HiveField(8)
  int awakenings;

  @HiveField(9)
  int remLatency;

  @HiveField(10)
  int numberTransitions;

  HiveSleepSequenceStats(
      this.uniqueId,
      this.analysisState,
      this.recordingStart,
      this.recordingEnd,
      this.effectiveSleepTimeInSeconds,
      this.sleepEfficiency,
      this.sleepLatency,
      this.wasoInSeconds,
      this.awakenings,
      this.remLatency,
      this.numberTransitions);
}
