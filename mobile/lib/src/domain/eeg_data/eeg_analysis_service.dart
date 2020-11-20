import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';

import '../unique_id.dart';
import 'eeg_metadata.dart';

class EEGAnalysisService {
  final dio = Dio();
  final ISleepSequenceRepository _sleepSequenceRepository;

  EEGAnalysisService(this._sleepSequenceRepository);

  void analyzeRecordingData(EEGMetadata recordingData) async {
    var startTimeUnix = recordingData.startTime.millisecondsSinceEpoch ~/ 1000;
    var endTimeUnix = recordingData.endTime.millisecondsSinceEpoch ~/ 1000;
    var pathOfFile = (await getExternalStorageDirectory()).path +
        '/' +
        recordingData.fileName;

    // todo: use settings for age, sex
    var formData = FormData.fromMap({
      'age': '23',
      'sex': 'M',
      'stream_start': startTimeUnix,
      'bedtime': startTimeUnix + 1, // Add 1 second
      'wakeup': endTimeUnix,
      'file': await MultipartFile.fromFile(pathOfFile,
          filename: recordingData.fileName),
    });

    // todo: Get rid of ip when using an internal server or add setting for ip
    var response = await dio.post('http://192.168.2.12:8182/analyze-sleep',
        data: formData);

    _store(_parseServerResponse(response, recordingData.id.toString()));
  }

  SleepSequenceStats _parseServerResponse(Response response, String fileId) {
    // todo: handle server errors
    if (response.statusCode != 200) return null;
    print(response.data['report']);
    var report = response.data['report'];
    var metadata = response.data['metadata'];
    return SleepSequenceStats(
        id: UniqueId.from(fileId),
        awakenings: report['awakenings'],
        effectiveSleepTime: Duration(seconds: report['efficientSleepTime']),
        numberTransitions: report['stagesShifts'],
        recordingTime: DateTimeRange(
            start: DateTime.fromMillisecondsSinceEpoch(
                metadata['sessionStartTime'].toInt() * 1000),
            end: DateTime.fromMillisecondsSinceEpoch(
                metadata['sessionEndTime'].toInt() * 1000)),
        remLatency: report['remLatency'],
        sleepEfficiency: report['sleepEfficiency'],
        sleepLatency: report['sleepOnset'],
        waso: Duration(seconds: report['WASO']));
  }

  void _store(SleepSequenceStats sequence) {
    var sequences = _sleepSequenceRepository.getAll();
    sequences.add(sequence);
    _sleepSequenceRepository.store(sequences);
  }
}
