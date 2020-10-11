import 'dart:io';

import 'package:csv/csv.dart';
import 'package:path_provider/path_provider.dart';
import 'package:polydodo/src/domain/eeg_data/eeg_data.dart';
import 'package:polydodo/src/domain/eeg_data/i_eeg_data_repository.dart';
import 'package:polydodo/src/domain/unique_id.dart';
import 'constants.dart';

class EEGDataRepository implements IEEGDataRepository {
  bool _streamInitialized = false;
  EEGData _recordingData;
  List _lastSampleData = [0, 0, 0, 0, 0];
  int _sampleCounter;

  void createRecordingFromStream(Stream<List<int>> stream) {
    _recordingData =
        EEGData(UniqueId.from(DateTime.now().toString()), List<List>());
    _sampleCounter = 0;
    if (!_streamInitialized) {
      _streamInitialized = true;
      stream.listen((value) {
        addData(value);
      });
    }
  }

  Future<void> stopRecordingFromStream() async {
    // todo: move save future to another file

    final directory = await getExternalStorageDirectory();
    final pathOfTheFileToWrite =
        directory.path + '/' + _recordingData.fileName + ".txt";
    File file = File(pathOfTheFileToWrite);
    List<List> fileContent = List<List>();
    fileContent.addAll(OPEN_BCI_HEADER);
    fileContent.addAll(_recordingData.values);
    String csv = const ListToCsvConverter().convert(fileContent);
    await file.writeAsString(csv);
  }

  // todo: implement export and import
  void importData() {}
  void exportData() {}

  Future<void> addData(List event) async {
    if (event.length != 20) {
      print("Invalid Event");
      return;
    }
    int packetID = event[0];

    // todo: handle packet id 0 (raw data) and possibly impedence for signal validation
    if (packetID == 0) {
      List data = parseRaw(event);
      data = convertToMicrovolts(data, false);

      _recordingData.values.add(data.sublist(0, 15));
    } else if (packetID >= 101 && packetID <= 200) {
      List data = parse19Bit(event);
      data = convertToMicrovolts(data, true);

      _recordingData.values.add(data.sublist(0, 15));
      _recordingData.values.add(data.sublist(15, 30));
    }
  }

  List parseRaw(event) {
    List data = getListForCSV();

    data[0] = _sampleCounter++;
    data[1] = (event[1] << 16) | (event[2] << 8) | event[3];
    data[2] = (event[4] << 16) | (event[5] << 8) | event[6];
    data[3] = (event[7] << 16) | (event[8] << 8) | event[9];
    data[4] = (event[10] << 16) | (event[11] << 8) | event[12];

    return data;
  }

  List parse19Bit(event) {
    // Test event, comment scale factor
    // event = [ 101, 0, 0, 0, 0, 8, 0, 5, 0, 0, 72, 0, 9, 240, 1, 176, 0, 48, 0, 8]; // Positive Test
    // Expected [[0, 2, 10, 4], [262148, 507910, 393222, 8]]
    // event = [ 101, 255, 255, 191, 255, 239, 255, 252, 255, 255, 88, 0, 11, 62, 56, 224, 0, 63, 240, 1 ]; // Negative Test
    // Expected [[-3, -5, -7, -11], [-262139, -198429, -262137, -4095]]

    List data = getListForCSV();

    data[0] = _sampleCounter;
    data[1] = (event[1] << 11) | (event[2] << 3) | (event[3] >> 5);
    data[2] = ((event[3] & 31) << 14) | (event[4] << 6) | (event[5] >> 2);
    data[3] = ((event[5] & 3) << 17) |
        (event[6] << 9) |
        (event[7] << 1) |
        (event[8] >> 7);
    data[4] = ((event[8] & 127) << 12) | (event[9] << 4) | (event[10] >> 4);
    data[15] = _sampleCounter++;
    data[16] = ((event[10] & 15) << 15) | (event[11] << 7) | (event[12] >> 1);
    data[17] = ((event[12] & 1) << 18) |
        (event[13] << 10) |
        (event[14] << 2) |
        (event[15] >> 6);
    data[18] = ((event[15] & 63) << 13) | (event[16] << 5) | (event[17] >> 3);
    data[19] = ((event[17] & 7) << 16) | (event[18] << 8) | (event[19]);

    return data;
  }

  List getListForCSV() {
    List data = List(30);

    for (int i = 5; i < 15; ++i) {
      data[i] = 0;
      data[i + 15] = 0;
    }
    return data;
  }

  List convertToMicrovolts(List data, bool isDelta) {
    for (int i = 1; i < 5; ++i) {
      for (int j = 0; j < 2; ++j) {
        if (j == 1 && !isDelta) break;

        int offset = 15 * j;
        String binary = data[i + offset].toRadixString(2);

        // Handle negatives
        if (isDelta && binary[binary.length - 1] == '1') {
          data[i + offset] = (~data[i + offset] & 524287 | 1) * -1;
        }

        // Convert to microvolts using the scale factor
        data[i + offset] =
            data[i + offset].toDouble() * (1200000 / (8388607.0 * 1.5 * 51.0));

        // Convert delta
        if (isDelta) data[i + offset] = _lastSampleData[i] - data[i + offset];

        _lastSampleData[i] = data[i + offset];
      }
    }

    return data;
  }
}
