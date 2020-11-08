import 'package:flutter/material.dart';
import 'package:polydodo/src/domain/sleep_history/night_stats.dart';
import 'package:polydodo/src/domain/unique_id.dart';

NightStats mock_data_1 = NightStats(
    id: UniqueId.from('test'),
    awakenings: 3,
    effectiveSleepTime: DateTime.now(),
    numberTransitions: 5,
    recordingTime: DateTimeRange(start: DateTime.now(), end: DateTime.now()),
    remLatency: 20,
    sleepEfficiency: 20.0,
    sleepLatency: 10,
    waso: DateTime.now());

NightStats mock_data_2 = NightStats(
    id: UniqueId.from('test2'),
    awakenings: 100,
    effectiveSleepTime: DateTime.now(),
    numberTransitions: 5,
    recordingTime: DateTimeRange(start: DateTime.now(), end: DateTime.now()),
    remLatency: 20,
    sleepEfficiency: 20.0,
    sleepLatency: 10,
    waso: DateTime.now());
