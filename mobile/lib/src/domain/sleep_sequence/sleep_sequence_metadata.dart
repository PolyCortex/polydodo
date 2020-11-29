import 'package:flutter/material.dart';

import 'analysis_state.dart';

class SleepSequenceMetadata {
  DateTimeRange sleepSequenceDateTimeRange;
  AnalysisState analysisState;

  SleepSequenceMetadata(this.sleepSequenceDateTimeRange, this.analysisState)
      : assert(!sleepSequenceDateTimeRange.duration.isNegative),
        assert(analysisState != null);
}
