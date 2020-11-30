import 'package:hive/hive.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_metrics.dart';

part 'hive_sleep_sequence_metrics.g.dart'; // Name of the TypeAdapter that we will generate in the future

@HiveType(typeId: 3)
class HiveSleepSequenceMetrics {
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
  int shifts;

  HiveSleepSequenceMetrics(
      {this.effectiveSleepTimeInSeconds,
      this.sleepEfficiency,
      this.sleepLatency,
      this.wasoInSeconds,
      this.awakenings,
      this.remLatency,
      this.shifts});

  HiveSleepSequenceMetrics.fromDomain(SleepSequenceMetrics metrics)
      : effectiveSleepTimeInSeconds = metrics.effectiveSleepTime.inSeconds,
        sleepEfficiency = metrics.sleepEfficiency,
        sleepLatency = metrics.sleepLatency,
        wasoInSeconds = metrics.waso.inSeconds,
        awakenings = metrics.awakenings,
        remLatency = metrics.remLatency,
        shifts = metrics.shifts;

  SleepSequenceMetrics toDomain() {
    return SleepSequenceMetrics(
        awakenings: awakenings,
        effectiveSleepTime: Duration(seconds: effectiveSleepTimeInSeconds),
        shifts: shifts,
        remLatency: remLatency,
        sleepEfficiency: sleepEfficiency,
        sleepLatency: sleepLatency,
        waso: Duration(seconds: wasoInSeconds));
  }
}
