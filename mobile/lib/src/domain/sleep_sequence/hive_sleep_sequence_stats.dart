import 'package:hive/hive.dart';

part 'hive_sleep_sequence_stats.g.dart'; // Name of the TypeAdapter that we will generate in the future

@HiveType(typeId: 1)
class HiveSleepSequenceStats {
  @HiveField(0)
  DateTime recordingStart;

  @HiveField(1)
  DateTime recordingEnd;

  @HiveField(2)
  double effectiveSleepTime;

  @HiveField(3)
  double sleepEfficiency;

  @HiveField(4)
  int sleepLatency;

  @HiveField(5)
  double waso;

  @HiveField(6)
  int awakenings;

  @HiveField(7)
  int remLatency;

  @HiveField(8)
  int numberTransitions;

  HiveSleepSequenceStats(
      this.recordingStart,
      this.recordingEnd,
      this.effectiveSleepTime,
      this.sleepEfficiency,
      this.sleepLatency,
      this.waso,
      this.awakenings,
      this.remLatency,
      this.numberTransitions);
}
