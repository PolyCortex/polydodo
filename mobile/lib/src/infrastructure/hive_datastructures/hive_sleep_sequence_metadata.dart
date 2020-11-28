import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:polydodo/src/domain/sleep_sequence/analysis_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_metadata.dart';

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

  HiveSleepSequenceMetadata.fromDomain(SleepSequenceMetadata metadata)
      : recordingStart = metadata.sleepSequenceDateTimeRange.start,
        recordingEnd = metadata.sleepSequenceDateTimeRange.end,
        analysisState = HiveAnalysisState.values[metadata.analysisState.index];

  SleepSequenceMetadata toDomain() {
    return SleepSequenceMetadata(
        DateTimeRange(start: recordingStart, end: recordingEnd),
        AnalysisState.values[analysisState.index]);
  }
}
