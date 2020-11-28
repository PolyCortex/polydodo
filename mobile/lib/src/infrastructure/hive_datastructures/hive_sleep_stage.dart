import 'package:hive/hive.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_stage.dart';

import 'hive_sleep_stage_type.dart';

part 'hive_sleep_stage.g.dart'; // Name of the TypeAdapter that we will generate in the future

@HiveType(typeId: 6)
class HiveSleepStage {
  @HiveField(0)
  HiveSleepStageType stage;

  @HiveField(1)
  int timestamp;

  HiveSleepStage(this.stage, this.timestamp);

  HiveSleepStage.fromDomain(SleepStage sleepStage)
      : stage = HiveSleepStageType.values[sleepStage.stage.index],
        timestamp = sleepStage.timestamp;

  SleepStage toDomain() {
    return SleepStage(SleepStageType.values[stage.index], timestamp);
  }
}
