import 'dart:async';
import 'dart:io';

import 'package:csv/csv.dart';
import 'package:path_provider/path_provider.dart';
import 'package:polydodo/src/domain/eeg_data/eeg_data.dart';
import 'package:polydodo/src/domain/eeg_data/i_eeg_data_repository.dart';
import 'package:polydodo/src/domain/unique_id.dart';
import 'package:polydodo/src/infrastructure/baseTransformer.dart';
import 'package:polydodo/src/infrastructure/ganglionTransformer.dart';
import 'constants.dart';

class EEGDataRepository implements IEEGDataRepository {
  EEGData _recordingData;
  StreamTransformer streamTransformer;

  void createRecordingFromStream(Stream<List<int>> stream) {
    _recordingData =
        EEGData(UniqueId.from(DateTime.now().toString()), List<List>());

    if (streamTransformer == null) {
      //todo: dynamically change transformer
      streamTransformer = new GanglionTransformer<List<int>, List>();
      stream
          .asBroadcastStream()
          .transform(streamTransformer)
          .listen((data) => _recordingData.values.add(data));
    } else {
      (streamTransformer as BaseTransformer).reset();
    }
  }

  Future<void> stopRecordingFromStream() async {
    // todo: move save future to another file

    final directory = await getExternalStorageDirectory();
    final pathOfTheFileToWrite =
        directory.path + '/' + _recordingData.fileName + ".txt";
    File file = File(pathOfTheFileToWrite);
    List<List> fileContent = [];
    fileContent.addAll(OPEN_BCI_HEADER);
    fileContent.addAll(_recordingData.values);
    String csv = const ListToCsvConverter().convert(fileContent);
    await file.writeAsString(csv);
  }

  // todo: implement export and import
  void importData() {}
  void exportData() {}
}
