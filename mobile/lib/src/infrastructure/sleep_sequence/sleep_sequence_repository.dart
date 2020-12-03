import 'dart:async';

import 'package:dio/dio.dart';
import 'package:hive/hive.dart';
import 'package:path_provider/path_provider.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device_type.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_acquisition_device_controller.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_metrics.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_stage.dart';
import 'package:polydodo/src/infrastructure/constants.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/analysis_state.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_sleep_sequence.dart';

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
    return _parseHiveSleepSequenceList(
        _sleepSequencesListBox.toMap().cast() ?? <String, HiveSleepSequence>{});
  }

  @override
  void store(SleepSequence sleepSequence) {
    _sleepSequencesListBox.put(sleepSequence.id.toString(),
        HiveSleepSequence.fromDomain(sleepSequence));
  }

  @override
  void delete(List<SleepSequence> sleepSequencesToDelete) {
    for (var sleepSequence in sleepSequencesToDelete) {
      _sleepSequencesListBox.delete(sleepSequence.id.toString());
    }
  }

  @override
  IAcquisitionDeviceController acquire(AcquisitionDeviceType deviceType) {
    _acquisitionDeviceController.setDeviceType(deviceType);
    return _acquisitionDeviceController;
  }

  // todo: clean analyze
  @override
  Future<SleepSequence> analyze(SleepSequence sleepSequence) async {
    final startTimeUnix = sleepSequence
            .metadata.sleepSequenceDateTimeRange.start.millisecondsSinceEpoch ~/
        1000;
    final endTimeUnix = sleepSequence
            .metadata.sleepSequenceDateTimeRange.end.millisecondsSinceEpoch ~/
        1000;
    final filename = sleepSequence.eegDataFilename;
    final pathOfFile =
        (await getExternalStorageDirectory()).path + '/' + filename;

    // todo: use settings for age, sex
    final formData = FormData.fromMap({
      'age': '23',
      'sex': 'M',
      'stream_start': startTimeUnix,
      'bedtime': startTimeUnix + 1, // Add 1 second
      'wakeup': endTimeUnix,
      'file': await MultipartFile.fromFile(pathOfFile, filename: filename),
    });

    // todo: Get rid of ip when using an internal server or add setting for ip
    try {
      final response = await dio.post('http://192.168.2.12:8182/analyze-sleep',
          data: formData);
      _parseServerResponse(response, sleepSequence);
    } catch (e) {
      sleepSequence.metadata.analysisState = AnalysisState.analysis_failed;
    }

    return sleepSequence;
  }

  List<SleepSequence> _parseHiveSleepSequenceList(
      Map<String, HiveSleepSequence> historyMap) {
    return historyMap.values
        .map<SleepSequence>((hiveSleepSequence) => hiveSleepSequence.toDomain())
        .toList();
  }

  void _parseServerResponse(Response response, SleepSequence sleepSequence) {
    print(response.statusCode);
    print(response.data);

    if (response.statusCode != 200) {
      sleepSequence.metadata.analysisState = AnalysisState.analysis_failed;
    } else {
      // response SleepStage = unix timestamp  DateTime.fromMillisecondsSinceEpoch(int timestampInMilliseconds)
      final report = response.data['report'];
      final epochs = response.data['epochs'];
      sleepSequence.metadata.analysisState = AnalysisState.analysis_successful;
      sleepSequence.metrics = SleepSequenceMetrics(
        awakenings: report['awakenings'],
        effectiveSleepTime: Duration(seconds: report['efficientSleepTime']),
        shifts: report['stageShifts'],
        remLatency: report['remLatency'],
        sleepEfficiency: report['sleepEfficiency'],
        sleepLatency: report['sleepOnset'],
        waso: Duration(seconds: report['WASO']),
      );

      final sleepStages = [];
      for (var i = 0; i < epochs['stages'].length; ++i) {
        sleepStages.add(SleepStage(
            SleepStageType.values[sleepStageMap[epochs['stages'][i]]],
            DateTime.fromMillisecondsSinceEpoch(
                epochs['timestamps'][i].round())));
      }
      sleepSequence.sleepStages = sleepStages.cast();
    }
  }
}
