import 'package:hive/hive.dart';
import 'package:polydodo/src/domain/sleep_sequence/analysis_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_stage.dart';
import 'package:polydodo/src/domain/unique_id.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_analysis_state.dart';

import 'hive_sleep_sequence_metadata.dart';
import 'hive_sleep_sequence_metrics.dart';
import 'hive_sleep_stage.dart';

part 'hive_sleep_sequence.g.dart'; // Name of the TypeAdapter that we will generate in the future

@HiveType(typeId: 4)
class HiveSleepSequence {
  @HiveField(0)
  String uniqueId;

  @HiveField(1)
  String eegDataFilename;

  @HiveField(2)
  HiveSleepSequenceMetadata metadata;

  @HiveField(3)
  HiveSleepSequenceMetrics metrics;

  @HiveField(4)
  List<HiveSleepStage> sleepStages;

  HiveSleepSequence(
      {this.uniqueId,
      this.eegDataFilename,
      this.metadata,
      this.metrics,
      this.sleepStages});

  HiveSleepSequence.fromDomain(SleepSequence sleepSequence)
      : uniqueId = sleepSequence.id.toString(),
        eegDataFilename = sleepSequence.eegDataFilename,
        metadata = HiveSleepSequenceMetadata.fromDomain(sleepSequence.metadata),
        metrics = (sleepSequence.metadata.analysisState ==
                AnalysisState.analysis_successful)
            ? HiveSleepSequenceMetrics.fromDomain(sleepSequence.metrics)
            : null,
        sleepStages = (sleepSequence.metadata.analysisState ==
                AnalysisState.analysis_successful)
            ? sleepSequence.sleepStages
                .map<HiveSleepStage>(
                    (sleepStage) => HiveSleepStage.fromDomain(sleepStage))
                .toList()
            : null;

  SleepSequence toDomain() {
    return SleepSequence(
        id: UniqueId.from(uniqueId),
        eegDataFilename: eegDataFilename,
        metadata: metadata.toDomain(),
        metrics:
            (metadata.analysisState == HiveAnalysisState.analysis_successful)
                ? metrics.toDomain()
                : null,
        sleepStages: (metadata.analysisState ==
                HiveAnalysisState.analysis_successful)
            ? sleepStages
                .map<SleepStage>((hiveSleepStage) => hiveSleepStage.toDomain())
                .toList()
            : null);
  }
}
