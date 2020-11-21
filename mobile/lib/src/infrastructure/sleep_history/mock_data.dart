import 'package:flutter/material.dart';
import 'package:polydodo/src/domain/sleep_sequence/analysis_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';
import 'package:polydodo/src/domain/unique_id.dart';

SleepSequenceStats mock_data_1 = SleepSequenceStats(
    id: UniqueId.from('test'),
    analysisState: AnalysisState.analysis_successful,
    awakenings: 3,
    effectiveSleepTime: Duration(minutes: 59),
    numberTransitions: 5,
    recordingTime: DateTimeRange(start: DateTime.now(), end: DateTime.now()),
    remLatency: 20,
    sleepEfficiency: 20.0,
    sleepLatency: 10,
    waso: Duration(minutes: 59));

SleepSequenceStats mock_data_2 = SleepSequenceStats(
    id: UniqueId.from('test2'),
    analysisState: AnalysisState.analysis_successful,
    awakenings: 100,
    effectiveSleepTime: Duration(minutes: 100),
    numberTransitions: 5,
    recordingTime: DateTimeRange(start: DateTime.now(), end: DateTime.now()),
    remLatency: 20,
    sleepEfficiency: 20.0,
    sleepLatency: 10,
    waso: Duration(minutes: 100));
