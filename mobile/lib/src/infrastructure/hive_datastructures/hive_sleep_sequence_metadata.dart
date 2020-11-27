import 'package:hive/hive.dart';

import 'hive_analysis_state.dart';

part 'hive_sleep_sequence_metadata.g.dart';

@HiveType(typeId: 2)
class HiveSleepSequenceMetadata {
  @HiveField(0)
  DateTime recordingStart;

  @HiveField(1)
  DateTime recordingEnd;

  @HiveField(2)
  HiveAnalysisState analysisState;

  HiveSleepSequenceMetadata(
      this.recordingStart, this.recordingEnd, this.analysisState);
}
