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

class EEGDataRepository implements IEEGDataRepository {
  EEGData _recordingData;
  BaseOpenBCITransformer<List<int>, List<dynamic>> streamTransformer;

  void createRecordingFromStream(Stream<List<int>> stream) {
    _recordingData =
        EEGData(UniqueId.from(DateTime.now().toString()), List<List>());

    if (streamTransformer == null) {
      //todo: dynamically change transformer
      // new GanglionTransformer<List<int>, List>.broadcast()
      streamTransformer = new CytonTransformer<Uint8List, List>.broadcast();
      stream
          .asBroadcastStream()
          .transform(streamTransformer)
          .listen((data) => _recordingData.values.add(data));
    } else {
      streamTransformer.reset();
    }
  }

  Future<void> stopRecordingFromStream() async {
    // todo: move save future to another file

    final directory = await getExternalStorageDirectory();
    final pathOfTheFileToWrite =
        directory.path + '/' + _recordingData.fileName + ".txt";
    File file = File(pathOfTheFileToWrite);
    List<List> fileContent = [];
    //todo: dynamically change header when we change transformer
    fileContent.addAll(OPEN_BCI_CYTON_HEADER);
    fileContent.addAll(_recordingData.values);
    String csv = const ListToCsvConverter().convert(fileContent);
    await file.writeAsString(csv);
  }

  // todo: implement export and import
  void importData() {}
  void exportData() {}
}
