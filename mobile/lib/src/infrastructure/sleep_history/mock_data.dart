import 'package:flutter/material.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';
import 'package:polydodo/src/domain/unique_id.dart';

SleepSequenceStats mock_data_1 = SleepSequenceStats(
    id: UniqueId.from('test'),
    awakenings: 3,
    effectiveSleepTime: 80.0,
    numberTransitions: 5,
    recordingTime: DateTimeRange(start: DateTime.now(), end: DateTime.now()),
    remLatency: 20,
    sleepEfficiency: 20.0,
    sleepLatency: 10,
    waso: 80.0);

SleepSequenceStats mock_data_2 = SleepSequenceStats(
    id: UniqueId.from('test2'),
    awakenings: 100,
    effectiveSleepTime: 100.0,
    numberTransitions: 5,
    recordingTime: DateTimeRange(start: DateTime.now(), end: DateTime.now()),
    remLatency: 20,
    sleepEfficiency: 20.0,
    sleepLatency: 10,
    waso: 100.0);
