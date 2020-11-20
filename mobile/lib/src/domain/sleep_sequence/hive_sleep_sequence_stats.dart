import 'package:hive/hive.dart';

part 'hive_sleep_sequence_stats.g.dart'; // Name of the TypeAdapter that we will generate in the future

@HiveType(typeId: 1)
class HiveSleepSequenceStats {
  @HiveField(0)
  DateTime recordingStart;

  @HiveField(1)
  DateTime recordingEnd;

  @HiveField(2)
  int effectiveSleepTimeInSeconds;

  @HiveField(3)
  double sleepEfficiency;

  @HiveField(4)
  int sleepLatency;

  @HiveField(5)
  int wasoInSeconds;

  @HiveField(6)
  int awakenings;

  @HiveField(7)
  int remLatency;

  @HiveField(8)
  int numberTransitions;

  HiveSleepSequenceStats(
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
