import 'dart:async';
import 'dart:io';
import 'dart:typed_data';

import 'package:csv/csv.dart';
import 'package:path_provider/path_provider.dart';
import 'package:polydodo/src/domain/eeg_data/eeg_data.dart';
import 'package:polydodo/src/domain/eeg_data/i_eeg_data_repository.dart';
import 'package:polydodo/src/domain/unique_id.dart';
import 'package:polydodo/src/infrastructure/eeg_data_transformers/baseOpenBCITransformer.dart';
import 'package:polydodo/src/infrastructure/eeg_data_transformers/cytonTransformer.dart';
import 'package:polydodo/src/infrastructure/constants.dart';
import 'package:polydodo/src/infrastructure/eeg_data_transformers/ganglionTransformer.dart';
import 'package:streaming_shared_preferences/streaming_shared_preferences.dart';
import 'package:pedantic/pedantic.dart';
import 'package:intl/intl.dart';

class EEGDataRepository implements IEEGDataRepository {
  EEGData _recordingData;
  BaseOpenBCITransformer<List<int>, List<dynamic>> currentStreamTransformer;

  final GanglionTransformer<List<int>, List> _ganglionTransformer =
      GanglionTransformer<List<int>, List>.broadcast();

  final CytonTransformer<List<int>, List<dynamic>> _cytonTransformer =
      CytonTransformer<Uint8List, List>.broadcast();

  BaseOpenBCITransformer<List<int>, List<dynamic>> _currentTransformer;
  StreamSubscription _currentTransformerStream;

  StreamingSharedPreferences _preferences;

  @override
  void initialize() async {
    _preferences ??= await StreamingSharedPreferences.instance;

    _currentTransformer =
        _preferences.getBool('using_bluetooth', defaultValue: false).getValue()
            ? _ganglionTransformer
            : _cytonTransformer;
  }

  @override
  void createRecordingFromStream(Stream<List<int>> stream) {
    _recordingData = EEGData(
        UniqueId.from(
            DateFormat.yMMMMd().add_jm().format(DateTime.now()).toString()),
        [[]]);

    _currentTransformer.reset();
    _currentTransformerStream = stream
        .asBroadcastStream()
        .transform(_currentTransformer)
        .listen((data) => _recordingData.values.add(data));
  }

  @override
  Future<void> stopRecordingFromStream() async {
    // todo: move save future to another file
    unawaited(_currentTransformerStream.cancel());

    final directory = await getExternalStorageDirectory();
    final pathOfTheFileToWrite =
        directory.path + '/' + _recordingData.fileName + '.txt';
    var file = File(pathOfTheFileToWrite);
    var fileContent = [[]];
    //todo: dynamically change header when we change transformer
    fileContent.addAll(OPEN_BCI_CYTON_HEADER);
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
