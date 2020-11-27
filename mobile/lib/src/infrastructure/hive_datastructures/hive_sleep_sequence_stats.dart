import 'package:hive/hive.dart';

part 'hive_sleep_sequence_stats.g.dart'; // Name of the TypeAdapter that we will generate in the future

@HiveType(typeId: 3)
class HiveSleepSequenceStats {
  @HiveField(0)
  int effectiveSleepTimeInSeconds;

  @HiveField(1)
  double sleepEfficiency;

  @HiveField(2)
  int sleepLatency;

  @HiveField(3)
  int wasoInSeconds;

  @HiveField(4)
  int awakenings;

  @HiveField(5)
  int remLatency;

  @HiveField(6)
  int numberTransitions;

  HiveSleepSequenceStats(
      {this.effectiveSleepTimeInSeconds,
      this.sleepEfficiency,
      this.sleepLatency,
      this.wasoInSeconds,
      this.awakenings,
      this.remLatency,
      this.numberTransitions});
}
