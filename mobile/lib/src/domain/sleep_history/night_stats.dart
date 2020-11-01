import 'package:polydodo/src/domain/entity.dart';
import 'package:flutter/foundation.dart';

class NightStats extends Entity {
  final DateTime recordingStart;
  final DateTime recordingEnd;
  final DateTime effectiveSleepTime;
  final double sleepEfficiency;
  final int sleepLatency;
  final DateTime waso;
  final int awakenings;
  final int remLatency;
  final int numberTransitions;

  NightStats(
      {id,
      @required this.recordingStart,
      @required this.recordingEnd,
      @required this.effectiveSleepTime,
      @required this.sleepEfficiency,
      @required this.sleepLatency,
      @required this.waso,
      @required this.awakenings,
      @required this.remLatency,
      @required this.numberTransitions})
      : super(id);

  String get fileName => id.toString();
}
