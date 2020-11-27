import 'dart:async';
import 'dart:io';
import 'dart:math';
import 'dart:typed_data';

import 'package:csv/csv.dart';
import 'package:intl/intl.dart';
import 'package:polydodo/src/domain/sleep_sequence/signal_result.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';
import 'package:flutter/material.dart';
import 'package:pedantic/pedantic.dart';
import 'package:path_provider/path_provider.dart';
import 'package:polydodo/src/domain/unique_id.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device_type.dart';
import 'package:polydodo/src/domain/sleep_sequence/analysis_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_acquisition_device_controller.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_metadata.dart';
import 'package:polydodo/src/infrastructure/constants.dart';
import 'package:polydodo/src/infrastructure/eeg_data_transformers/baseOpenBCITransformer.dart';
import 'package:polydodo/src/infrastructure/eeg_data_transformers/cytonTransformer.dart';
import 'package:polydodo/src/infrastructure/eeg_data_transformers/ganglionTransformer.dart';

class AcquisitionDeviceController implements IAcquisitionDeviceController {
  final GanglionTransformer<List<int>, List> _ganglionTransformer =
      GanglionTransformer<List<int>, List>.broadcast();
  final CytonTransformer<List<int>, List<dynamic>> _cytonTransformer =
      CytonTransformer<Uint8List, List>.broadcast();
  final List<List> _recordingData = [[]];

  BaseOpenBCITransformer<List<int>, List<dynamic>> currentStreamTransformer;
  BaseOpenBCITransformer<List<int>, List<dynamic>> _currentTransformer;
  StreamSubscription _currentTransformerStream;
  DateTime _recordingStart;
  double _fpzCzChannelMax = 0;
  double _pzOzChannelMax = 0;
  int _dataCount = 0;

  @override
  void setDeviceType(AcquisitionDeviceType deviceType) async {
    _currentTransformer = (deviceType == AcquisitionDeviceType.bluetooth)
        ? _ganglionTransformer
        : _cytonTransformer;
  }

  @override
  void startRecording(Stream<List<int>> stream) {
    _recordingStart = DateTime.now();
    _recordingData.clear();

    _currentTransformer.reset();
    _currentTransformerStream = stream
        .asBroadcastStream()
        .transform(_currentTransformer)
        .listen((data) => _recordingData.add(data));
  }

  @override
  Future<SleepSequence> stop() async {
    unawaited(_currentTransformerStream.cancel());

    if (_recordingData.isEmpty) return null;

    var id = DateFormat.yMMMMd().add_jm().format(_recordingStart);

    await _saveRecording(id);

    return SleepSequence(
      id: UniqueId.from(id),
      eegDataFilename: id + '.txt',
      metadata: SleepSequenceMetadata(
          DateTimeRange(start: _recordingStart, end: DateTime.now()),
          AnalysisState.analysis_pending),
      stats: SleepSequenceStats(),
      sleepStages: [],
    );
  }

  @override
  void testSignal(Stream<List<int>> stream,
      Function(SignalResult, SignalResult, [Exception]) callback) {
    _dataCount = 0;
    _recordingData.clear();
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

  void _saveRecording(String filename) async {
    final directory = await getExternalStorageDirectory();
    final pathOfTheFileToWrite = directory.path + '/' + filename + '.txt';
    var file = File(pathOfTheFileToWrite);
    var fileContent = [[]];
    fileContent.addAll((_currentTransformer == _ganglionTransformer)
        ? OPEN_BCI_GANGLION_HEADER
        : OPEN_BCI_CYTON_HEADER);
    fileContent.addAll(_recordingData);
    var csv = const ListToCsvConverter().convert(fileContent);
    await file.writeAsString(csv);
  }
}
