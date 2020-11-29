import 'package:meta/meta.dart';
import 'package:polydodo/src/domain/entity.dart';

import 'sleep_sequence_metadata.dart';
import 'sleep_sequence_metrics.dart';
import 'sleep_stage.dart';

class SleepSequence extends Entity {
  final String eegDataFilename;
  SleepSequenceMetadata metadata;
  SleepSequenceMetrics metrics;
  List<SleepStage> sleepStages;

  SleepSequence(
      {@required id,
      @required this.eegDataFilename,
      @required this.metadata,
      this.metrics,
      this.sleepStages})
      : assert(eegDataFilename.isNotEmpty),
        super(id);
}
