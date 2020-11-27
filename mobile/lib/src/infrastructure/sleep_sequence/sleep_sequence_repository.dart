import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:path_provider/path_provider.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device_type.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_acquisition_device_controller.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_metadata.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_stage.dart';
import 'package:polydodo/src/domain/unique_id.dart';
import 'package:polydodo/src/infrastructure/constants.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/analysis_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_sleep_sequence_metadata.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_sleep_stage.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_sleep_stage_type.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_analysis_state.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_sleep_sequence.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_sleep_sequence_stats.dart';

import 'acquisition_device_controller.dart';

class SleepSequenceRepository implements ISleepSequenceRepository {
  final _acquisitionDeviceController = AcquisitionDeviceController();
  final dio = Dio();

  Box _sleepSequencesListBox;

  SleepSequenceRepository() {
    _loadHiveBox();
  }

  void _loadHiveBox() async {
    _sleepSequencesListBox = await Hive.openBox(POLYDODO_BOX);
  }

  @override
  List<SleepSequence> getAll() {
    // todo: check if empty database returns something from toMap
    return _parseHiveSleepSequenceList(_sleepSequencesListBox.toMap() ?? {});
  }

  @override
  void store(SleepSequence sequence) {
    _sleepSequencesListBox.put(
        sequence.id.toString(), _parseSleepSequence(sequence));
  }

  @override
  void delete(List<SleepSequence> sequencesToDelete) {
    for (var sequence in sequencesToDelete) {
      _sleepSequencesListBox.delete(sequence.id.toString());
    }
  }

  @override
  IAcquisitionDeviceController acquire(AcquisitionDeviceType deviceType) {
    _acquisitionDeviceController.setDeviceType(deviceType);
    return _acquisitionDeviceController;
  }

  // todo: clean analyze
  @override
  Future<SleepSequence> analyze(SleepSequence sequence) async {
    var startTimeUnix =
        sequence.metadata.sequenceDuration.start.millisecondsSinceEpoch ~/ 1000;
    var endTimeUnix =
        sequence.metadata.sequenceDuration.end.millisecondsSinceEpoch ~/ 1000;
    var filename = sequence.eegDataFilename;
    var pathOfFile =
        (await getExternalStorageDirectory()).path + '/' + filename;

    // todo: use settings for age, sex
    var formData = FormData.fromMap({
      'age': '23',
      'sex': 'M',
      'stream_start': startTimeUnix,
      'bedtime': startTimeUnix + 1, // Add 1 second
      'wakeup': endTimeUnix,
      'file': await MultipartFile.fromFile(pathOfFile, filename: filename),
    });

    // todo: Get rid of ip when using an internal server or add setting for ip
    try {
      var response = await dio.post('http://192.168.2.12:8182/analyze-sleep',
          data: formData);
      _parseServerResponse(response, sequence);
    } catch (e) {
      sequence.metadata.analysisState = AnalysisState.analysis_failed;
    }

    return sequence;
  }

  List<SleepSequence> _parseHiveSleepSequenceList(var historyMap) {
    // ignore: omit_local_variable_types
    List<SleepSequence> list = [];

    historyMap.forEach((key, sequence) {
      list.add(SleepSequence(
          id: UniqueId.from(sequence.uniqueId),
          eegDataFilename: sequence.eegDataFilename,
          metadata: SleepSequenceMetadata(
              DateTimeRange(
                  start: sequence.metadata.recordingStart,
                  end: sequence.metadata.recordingEnd),
              AnalysisState.values[sequence.metadata.analysisState.index]),
          stats: SleepSequenceStats(
              awakenings: sequence.stats.awakenings,
              effectiveSleepTime:
                  Duration(seconds: sequence.stats.effectiveSleepTimeInSeconds),
              numberTransitions: sequence.stats.numberTransitions,
              remLatency: sequence.stats.remLatency,
              sleepEfficiency: sequence.stats.sleepEfficiency,
              sleepLatency: sequence.stats.sleepLatency,
              waso: Duration(seconds: sequence.stats.wasoInSeconds)),
          sleepStages: sequence.sleepStages
              .map<SleepStage>((hiveSleepStage) => SleepStage(
                  SleepStageType.values[hiveSleepStage.stage.index],
                  hiveSleepStage.timestamp))
              .toList()));
    });

    return list;
  }

  HiveSleepSequence _parseSleepSequence(SleepSequence sequence) {
    print(sequence.sleepStages);

    return HiveSleepSequence(
      uniqueId: sequence.id.toString(),
      eegDataFilename: sequence.eegDataFilename,
      metadata: HiveSleepSequenceMetadata(
          sequence.metadata.sequenceDuration.start,
          sequence.metadata.sequenceDuration.end,
          HiveAnalysisState.values[sequence.metadata.analysisState.index]),
      stats: HiveSleepSequenceStats(
          effectiveSleepTimeInSeconds:
              sequence.stats.effectiveSleepTime.inSeconds,
          sleepEfficiency: sequence.stats.sleepEfficiency,
          sleepLatency: sequence.stats.sleepLatency,
          wasoInSeconds: sequence.stats.waso.inSeconds,
          awakenings: sequence.stats.awakenings,
          remLatency: sequence.stats.remLatency,
          numberTransitions: sequence.stats.numberTransitions),
      sleepStages: sequence.sleepStages
          .map<HiveSleepStage>((sleepStage) => HiveSleepStage(
              HiveSleepStageType.values[sleepStage.stage.index],
              sleepStage.timestamp))
          .toList(),
    );
  }

  void _parseServerResponse(Response response, SleepSequence sequence) {
    // todo: Choose if we want to make a copy or work inside the sequence
    if (response.statusCode != 200) {
      sequence.metadata.analysisState = AnalysisState.analysis_failed;
    } else {
      var report = response.data['report'];

      sequence.metadata.analysisState = AnalysisState.analysis_successful;
      sequence.stats.awakenings = report['awakenings'];
      sequence.stats.effectiveSleepTime =
          Duration(seconds: report['efficientSleepTime']);
      sequence.stats.numberTransitions = report['stagesShifts'];
      sequence.stats.remLatency = report['remLatency'];
      sequence.stats.sleepEfficiency = report['sleepEfficiency'];
      sequence.stats.sleepLatency = report['sleepOnset'];
      sequence.stats.waso = Duration(seconds: report['WASO']);
    }
  }
}
