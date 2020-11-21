import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';
import 'package:polydodo/src/domain/sleep_sequence/analysis_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';

class EEGAnalysisService {
  final dio = Dio();
  final ISleepSequenceRepository _sleepSequenceRepository;

  EEGAnalysisService(this._sleepSequenceRepository) {
    dio.options.connectTimeout = 5000;
  }

  Future<SleepSequenceStats> analyzeRecordingData(
      SleepSequenceStats recordingData) async {
    var startTimeUnix =
        recordingData.recordingTime.start.millisecondsSinceEpoch ~/ 1000;
    var endTimeUnix =
        recordingData.recordingTime.end.millisecondsSinceEpoch ~/ 1000;
    var filename = recordingData.id.toString() + '.txt';
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
      _store(_parseServerResponse(response, recordingData));
    } catch (e) {
      recordingData.analysisState = AnalysisState.analysis_failed;
    }

    return recordingData;
  }

  SleepSequenceStats _parseServerResponse(
      Response response, SleepSequenceStats recordingData) {
    if (response.statusCode != 200) {
      recordingData.analysisState = AnalysisState.analysis_failed;
    } else {
      var report = response.data['report'];

      recordingData.analysisState = AnalysisState.analysis_successful;
      recordingData.analysisState = report['awakenings'];
      recordingData.effectiveSleepTime =
          Duration(seconds: report['efficientSleepTime']);
      recordingData.numberTransitions = report['stagesShifts'];
      recordingData.remLatency = report['remLatency'];
      recordingData.sleepEfficiency = report['sleepEfficiency'];
      recordingData.sleepLatency = report['sleepOnset'];
      recordingData.waso = Duration(seconds: report['WASO']);
    }

    return recordingData;
  }

  void _store(SleepSequenceStats sequence) {
    var sequences = _sleepSequenceRepository.getAll();
    sequences.add(sequence);
    _sleepSequenceRepository.store(sequences);
  }
}
