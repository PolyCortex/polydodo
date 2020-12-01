import 'package:hive/hive.dart';

part 'hive_sleep_stage_type.g.dart'; // Name of the TypeAdapter that we will generate in the future

@HiveType(typeId: 5)
enum HiveSleepStageType {
  @HiveField(0)
  wake,
  @HiveField(1)
  rem,
  @HiveField(2)
  n1,
  @HiveField(3)
  n2,
  @HiveField(4)
  n3,
}
