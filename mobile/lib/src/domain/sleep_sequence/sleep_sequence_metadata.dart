import 'package:flutter/material.dart';

import 'analysis_state.dart';

class SleepSequenceMetadata {
  DateTimeRange sequenceDuration;
  AnalysisState analysisState;

  SleepSequenceMetadata(this.sequenceDuration, this.analysisState);
}
