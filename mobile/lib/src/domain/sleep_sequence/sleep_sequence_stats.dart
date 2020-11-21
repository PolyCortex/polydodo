import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:polydodo/src/domain/sleep_sequence/analysis_state.dart';

import '../unique_id.dart';

class SleepSequenceStats {
  final UniqueId id;
  final DateTimeRange recordingTime;
  AnalysisState analysisState;
  Duration effectiveSleepTime;
  double sleepEfficiency;
  int sleepLatency;
  Duration waso;
  int awakenings;
  int remLatency;
  int numberTransitions;

  SleepSequenceStats({
    @required this.id,
    @required this.analysisState,
    @required this.recordingTime,
    this.effectiveSleepTime,
    this.sleepEfficiency,
    this.sleepLatency,
    this.waso,
    this.awakenings,
    this.remLatency,
    this.numberTransitions,
  });
}
