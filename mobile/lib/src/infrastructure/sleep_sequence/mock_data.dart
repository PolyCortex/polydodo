import 'package:flutter/material.dart';
import 'package:polydodo/src/domain/sleep_sequence/analysis_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_metadata.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_metrics.dart';
import 'package:polydodo/src/domain/unique_id.dart';

// todo: create mock for sleepStages

SleepSequence mock_data_1 = SleepSequence(
    id: UniqueId.from('test'),
    eegDataFilename: '',
    metadata: SleepSequenceMetadata(
        DateTimeRange(start: DateTime.now(), end: DateTime.now()),
        AnalysisState.analysis_successful),
    metrics: SleepSequenceMetrics(
        awakenings: 3,
        effectiveSleepTime: Duration(minutes: 59),
        shifts: 5,
        remLatency: 20,
        sleepEfficiency: 20.0,
        sleepLatency: 10,
        waso: Duration(minutes: 59)),
    sleepStages: []);

SleepSequence mock_data_2 = SleepSequence(
    id: UniqueId.from('test2'),
    eegDataFilename: '',
    metadata: SleepSequenceMetadata(
        DateTimeRange(start: DateTime.now(), end: DateTime.now()),
        AnalysisState.analysis_successful),
    metrics: SleepSequenceMetrics(
        awakenings: 100,
        effectiveSleepTime: Duration(minutes: 100),
        shifts: 5,
        remLatency: 20,
        sleepEfficiency: 20.0,
        sleepLatency: 10,
        waso: Duration(minutes: 100)),
    sleepStages: []);
