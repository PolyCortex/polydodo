import 'dart:async';

import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:polydodo/src/domain/sleep_sequence/hive_sleep_sequence_stats.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';
import 'package:polydodo/src/domain/unique_id.dart';
import 'package:polydodo/src/infrastructure/constants.dart';

class SleepSequenceRepository implements ISleepSequenceRepository {
  final sequenceStreamController = StreamController<SleepSequenceStats>();
  Box _sleepSequencesListBox;

  SleepSequenceRepository() {
    _loadHiveBox();
  }

  void _loadHiveBox() async {
    _sleepSequencesListBox = await Hive.openBox(POLYDODO_BOX);
  }

  @override
  List<SleepSequenceStats> getAll() {
    return _parseHiveSleepSequenceList(
        _sleepSequencesListBox.get(SLEEP_SEQUENCES_LIST_KEY) ?? []);
  }

  @override
  void store(List<SleepSequenceStats> sequence) {
    _sleepSequencesListBox.put(
        SLEEP_SEQUENCES_LIST_KEY, _parseSleepSequenceList(sequence));
  }

  @override
  void delete(List<SleepSequenceStats> sequences,
      List<SleepSequenceStats> sequencesToDelete) {
    for (var sequence in sequencesToDelete) {
      sequences.remove(sequence);
    }

    store(sequences);
  }

  List<SleepSequenceStats> _parseHiveSleepSequenceList(var historyList) {
    // ignore: omit_local_variable_types
    List<SleepSequenceStats> list = [];

    for (var sequence in historyList) {
      list.add(SleepSequenceStats(
          id: UniqueId.from(sequence.recordingStart.toString()),
          awakenings: sequence.awakenings,
          effectiveSleepTime:
              Duration(seconds: sequence.effectiveSleepTimeInSeconds),
          numberTransitions: sequence.numberTransitions,
          recordingTime: DateTimeRange(
              start: sequence.recordingStart, end: sequence.recordingEnd),
          remLatency: sequence.remLatency,
          sleepEfficiency: sequence.sleepEfficiency,
          sleepLatency: sequence.sleepLatency,
          waso: Duration(seconds: sequence.wasoInSeconds)));
    }

    return list;
  }

  List<HiveSleepSequenceStats> _parseSleepSequenceList(
      List<SleepSequenceStats> historyList) {
    // ignore: omit_local_variable_types
    List<HiveSleepSequenceStats> list = [];

    for (var sequence in historyList) {
      list.add(HiveSleepSequenceStats(
          sequence.recordingTime.start,
          sequence.recordingTime.end,
          sequence.effectiveSleepTime.inSeconds,
          sequence.sleepEfficiency,
          sequence.sleepLatency,
          sequence.waso.inSeconds,
          sequence.awakenings,
          sequence.remLatency,
          sequence.numberTransitions));
    }

    return list;
  }
}
