import 'package:hive/hive.dart';

import 'hive_sleep_sequence_metadata.dart';
import 'hive_sleep_sequence_stats.dart';
import 'hive_sleep_stage.dart';

part 'hive_sleep_sequence.g.dart'; // Name of the TypeAdapter that we will generate in the future

// final UniqueId id;
// final String eegDataFilename;
// SleepSequenceMetadata metadata;
// SleepSequenceStats stats;
// List<SleepStages> sleepStages;

@HiveType(typeId: 4)
class HiveSleepSequence {
  @HiveField(0)
  String uniqueId;

  @HiveField(1)
  String eegDataFilename;

  @HiveField(2)
  HiveSleepSequenceMetadata metadata;

  @HiveField(3)
  HiveSleepSequenceStats stats;

  @HiveField(4)
  List<HiveSleepStage> sleepStages;

  HiveSleepSequence(
      {this.uniqueId,
      this.eegDataFilename,
      this.metadata,
      this.stats,
      this.sleepStages});
}
