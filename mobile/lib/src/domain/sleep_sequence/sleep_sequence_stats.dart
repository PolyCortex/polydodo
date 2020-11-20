import 'package:flutter/material.dart';
import 'package:polydodo/src/domain/entity.dart';
import 'package:flutter/foundation.dart';

class SleepSequenceStats extends Entity {
  final DateTimeRange recordingTime;
  final Duration effectiveSleepTime;
  final double sleepEfficiency;
  final int sleepLatency;
  final Duration waso;
  final int awakenings;
  final int remLatency;
  final int numberTransitions;

  SleepSequenceStats(
      {id,
      @required this.recordingTime,
      @required this.effectiveSleepTime,
      @required this.sleepEfficiency,
      @required this.sleepLatency,
      @required this.waso,
      @required this.awakenings,
      @required this.remLatency,
      @required this.numberTransitions})
      : super(id);

  String get stringId => id.toString();
}
