import 'package:meta/meta.dart';
import 'package:polydodo/src/domain/unique_id.dart';

import 'sleep_sequence_metadata.dart';
import 'sleep_sequence_stats.dart';
import 'sleep_stage.dart';

class SleepSequence {
  final UniqueId id;
  final String eegDataFilename;
  SleepSequenceMetadata metadata;
  SleepSequenceStats stats;
  List<SleepStage> sleepStages;

  SleepSequence(
      {@required this.id,
      @required this.eegDataFilename,
      @required this.metadata,
      this.stats,
      this.sleepStages});
}
