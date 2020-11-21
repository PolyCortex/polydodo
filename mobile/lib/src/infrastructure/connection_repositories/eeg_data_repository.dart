import 'dart:async';
import 'dart:io';
import 'dart:math';
import 'dart:typed_data';

import 'package:csv/csv.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:polydodo/src/domain/acquisition_device/device_type.dart';
import 'package:polydodo/src/domain/eeg_data/eeg_data.dart';
import 'package:polydodo/src/domain/eeg_data/i_eeg_data_repository.dart';
import 'package:polydodo/src/domain/eeg_data/signal_result.dart';
import 'package:polydodo/src/domain/sleep_sequence/analysis_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';
import 'package:polydodo/src/domain/unique_id.dart';
import 'package:polydodo/src/infrastructure/eeg_data_transformers/baseOpenBCITransformer.dart';
import 'package:polydodo/src/infrastructure/eeg_data_transformers/cytonTransformer.dart';
import 'package:polydodo/src/infrastructure/constants.dart';
import 'package:polydodo/src/infrastructure/eeg_data_transformers/ganglionTransformer.dart';
import 'package:pedantic/pedantic.dart';
import 'package:intl/intl.dart';

class EEGDataRepository implements IEEGDataRepository {
  final GanglionTransformer<List<int>, List> _ganglionTransformer =
      GanglionTransformer<List<int>, List>.broadcast();
  final CytonTransformer<List<int>, List<dynamic>> _cytonTransformer =
      CytonTransformer<Uint8List, List>.broadcast();

  BaseOpenBCITransformer<List<int>, List<dynamic>> currentStreamTransformer;
  BaseOpenBCITransformer<List<int>, List<dynamic>> _currentTransformer;
  StreamSubscription _currentTransformerStream;
  EEGData _recordingData;
  double _fpzCzChannelMax = 0;
  double _pzOzChannelMax = 0;
  int _dataCount = 0;

  @override
  void initialize(DeviceType deviceType) async {
    _currentTransformer = (deviceType == DeviceType.bluetooth)
        ? _ganglionTransformer
        : _cytonTransformer;
  }

  @override
  void createRecordingFromStream(Stream<List<int>> stream) {
    _recordingData = EEGData(
        UniqueId.from(DateFormat.yMMMMd().add_jm().format(DateTime.now())),
        DateTime.now(),
        [[]]);

    _currentTransformer.reset();
    _currentTransformerStream = stream
        .asBroadcastStream()
        .transform(_currentTransformer)
        .listen((data) => _recordingData.values.add(data));
  }

  @override
  Future<SleepSequenceStats> stopRecordingFromStream() async {
    unawaited(_currentTransformerStream.cancel());

    if (_recordingData == null) return null;

    await _saveRecording();

    return SleepSequenceStats(
        id: _recordingData.id,
        analysisState: AnalysisState.analysis_pending,
        recordingTime: DateTimeRange(
            start: _recordingData.startTime, end: DateTime.now()));
  }

  @override
  void testSignal(Stream<List<int>> stream,
      Function(SignalResult, SignalResult, [Exception]) callback) {
    _dataCount = 0;
    _currentTransformer.reset();
    _currentTransformerStream = stream
        .asBroadcastStream()
        .transform(_currentTransformer)
        .listen((data) => _checkSignalData(data, callback));
  }

  void _checkSignalData(
      List data, Function(SignalResult, SignalResult, [Exception]) callback) {
    _dataCount++;

    _fpzCzChannelMax = max(_fpzCzChannelMax, data[1].abs());
    _pzOzChannelMax = max(_pzOzChannelMax, data[2].abs());

    if (_dataCount == 1000) {
      var signalOneResult = _getResult(_fpzCzChannelMax);
      var signalTwoResult = _getResult(_pzOzChannelMax);

      callback(signalOneResult, signalTwoResult);

      _dataCount = 0;
      _fpzCzChannelMax = 0;
      _pzOzChannelMax = 0;
    }
  }

  SignalResult _getResult(double maxValue) {
    var result = SignalResult.good;

    if (maxValue > MAX_SIGNAL_VALUE * THRESHOLD_RAILED_WARN) {
      result = (maxValue > MAX_SIGNAL_VALUE * THRESHOLD_RAILED)
          ? SignalResult.railed
          : SignalResult.near_railed;
    }

    return result;
  }

  Future<void> _saveRecording() async {
    final directory = await getExternalStorageDirectory();
    final pathOfTheFileToWrite = directory.path + '/' + _recordingData.fileName;
    var file = File(pathOfTheFileToWrite);
    var fileContent = [[]];
    fileContent.addAll((_currentTransformer == _ganglionTransformer)
        ? OPEN_BCI_GANGLION_HEADER
        : OPEN_BCI_CYTON_HEADER);
    fileContent.addAll(_recordingData.values);
    var csv = const ListToCsvConverter().convert(fileContent);
    await file.writeAsString(csv);
  }

  // todo: implement export and import
  @override
  void importData() {}

  @override
  void exportData() {}
}
