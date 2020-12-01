import 'package:flutter/material.dart';

import 'analysis_state.dart';

class SleepSequenceMetadata {
  DateTimeRange sleepSequenceDateTimeRange;
  AnalysisState analysisState;

  SleepSequenceMetadata(this.sleepSequenceDateTimeRange, this.analysisState)
      : assert(sleepSequenceDateTimeRange != null,
            'sleepSequenceDateTimeRange cannot be null'),
        assert(!sleepSequenceDateTimeRange.duration.isNegative,
            'sleepSequenceDateTimeRange cannot have negative duration'),
        assert(analysisState != null, 'analysisState cannot be null');
}
