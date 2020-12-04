import 'package:flutter/material.dart';
import 'package:polydodo/src/domain/sleep_sequence/analysis_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_metadata.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_metrics.dart';
import 'package:polydodo/src/domain/unique_id.dart';

// todo: create mock for sleepStages

List<SleepSequence> mock_data = [
  SleepSequence(
      id: UniqueId.from('test'),
      eegDataFilename: 'test.txt',
      metadata: SleepSequenceMetadata(
          DateTimeRange(start: DateTime.now(), end: DateTime.now()),
          AnalysisState.analysis_successful),
      metrics: SleepSequenceMetrics(
          awakenings: 3,
          effectiveSleepTime: Duration(minutes: 59),
          shifts: 5,
          remLatency: 20,
          sleepEfficiency: 0.4,
          sleepLatency: 20,
          waso: Duration(minutes: 59)),
      sleepStages: []),
  SleepSequence(
      id: UniqueId.from('test2'),
      eegDataFilename: 'test2.txt',
      metadata: SleepSequenceMetadata(
          DateTimeRange(start: DateTime.now(), end: DateTime.now()),
          AnalysisState.analysis_successful),
      metrics: SleepSequenceMetrics(
          awakenings: 100,
          effectiveSleepTime: Duration(minutes: 100),
          shifts: 5,
          remLatency: 20,
          sleepEfficiency: 0.2,
          sleepLatency: 10,
          waso: Duration(minutes: 540)),
      sleepStages: []),
  SleepSequence(
      id: UniqueId.from('test3'),
      eegDataFilename: 'test3.txt',
      metadata: SleepSequenceMetadata(
          DateTimeRange(start: DateTime.now(), end: DateTime.now()),
          AnalysisState.analysis_successful),
      metrics: SleepSequenceMetrics(
          awakenings: 100,
          effectiveSleepTime: Duration(minutes: 300),
          shifts: 5,
          remLatency: 26,
          sleepEfficiency: 0.5,
          sleepLatency: 3,
          waso: Duration(minutes: 100)),
      sleepStages: []),
  SleepSequence(
      id: UniqueId.from('test3'),
      eegDataFilename: 'test3.txt',
      metadata: SleepSequenceMetadata(
          DateTimeRange(start: DateTime.now(), end: DateTime.now()),
          AnalysisState.analysis_successful),
      metrics: SleepSequenceMetrics(
          awakenings: 100,
          effectiveSleepTime: Duration(minutes: 300),
          shifts: 5,
          remLatency: 26,
          sleepEfficiency: 0.76,
          sleepLatency: 3,
          waso: Duration(minutes: 100)),
      sleepStages: []),
  SleepSequence(
      id: UniqueId.from('test3'),
      eegDataFilename: 'test3.txt',
      metadata: SleepSequenceMetadata(
          DateTimeRange(start: DateTime.now(), end: DateTime.now()),
          AnalysisState.analysis_successful),
      metrics: SleepSequenceMetrics(
          awakenings: 100,
          effectiveSleepTime: Duration(minutes: 300),
          shifts: 5,
          remLatency: 26,
          sleepEfficiency: 0.45,
          sleepLatency: 3,
          waso: Duration(minutes: 100)),
      sleepStages: []),
  SleepSequence(
      id: UniqueId.from('test3'),
      eegDataFilename: 'test3.txt',
      metadata: SleepSequenceMetadata(
          DateTimeRange(start: DateTime.now(), end: DateTime.now()),
          AnalysisState.analysis_successful),
      metrics: SleepSequenceMetrics(
          awakenings: 100,
          effectiveSleepTime: Duration(minutes: 300),
          shifts: 5,
          remLatency: 26,
          sleepEfficiency: 0.39,
          sleepLatency: 3,
          waso: Duration(minutes: 100)),
      sleepStages: []),
  SleepSequence(
      id: UniqueId.from('test3'),
      eegDataFilename: 'test3.txt',
      metadata: SleepSequenceMetadata(
          DateTimeRange(start: DateTime.now(), end: DateTime.now()),
          AnalysisState.analysis_successful),
      metrics: SleepSequenceMetrics(
          awakenings: 100,
          effectiveSleepTime: Duration(minutes: 300),
          shifts: 5,
          remLatency: 26,
          sleepEfficiency: 0.65,
          sleepLatency: 3,
          waso: Duration(minutes: 100)),
      sleepStages: [])
];
