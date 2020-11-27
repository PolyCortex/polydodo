import 'package:hive/hive.dart';

import 'hive_sleep_stage_type.dart';

part 'hive_sleep_stage.g.dart'; // Name of the TypeAdapter that we will generate in the future

@HiveType(typeId: 6)
class HiveSleepStage {
  @HiveField(0)
  HiveSleepStageType stage;

  @HiveField(1)
  int timestamp;

  HiveSleepStage(this.stage, this.timestamp);
}
