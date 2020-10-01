import 'dart:io';

import 'package:csv/csv.dart';
import 'package:path_provider/path_provider.dart';
import 'package:polydodo/src/domain/domain.dart';

class EEGDataRepository implements IEEGDataRepository {
  EEGData recordingData;

  void createRecordingFromStream(Stream<List<int>> stream) {
    recordingData =
        new EEGData(UniqueId.from(DateTime.now().toString()), initializeData());
    stream.listen((value) {
      addData(value);
    });
  }

  void stopRecordingFromStream() async {
    // todo: move save future to another file
    final directory = await getExternalStorageDirectory();
    final pathOfTheFileToWrite =
        directory.path + '/' + recordingData.fileName + ".txt";
    File file = File(pathOfTheFileToWrite);
    String csv = const ListToCsvConverter().convert(recordingData.values);
    await file.writeAsString(csv);
  }

  // todo: implement export and import
  void importData() {}
  void exportData() {}

  List<List> initializeData() {
    List<List> values = new List<List>();
    values.add(["%OpenBCI Raw EEG Data"]);
    values.add(["%Number of channels = 4"]);
    values.add(["%Sample Rate = 200 Hz"]);
    values.add(["%Board = OpenBCI_GUI\$BoardGanglionBLE"]);
    values.add([
      "Sample Index",
      " EXG Channel 0",
      " EXG Channel 1",
      " EXG Channel 2",
      " EXG Channel 3",
      " Accel Channel 0",
      " Accel Channel 1",
      " Accel Channel 2",
      " Other",
      " Other",
      " Other",
      " Other",
      " Other",
      " Timestamp",
      " Timestamp (Formatted)"
    ]);

    return values;
  }

  void addData(event) async {
    int packetID = event[0];

    // todo: handle packet id 0 (raw data) and possibly impedence for signal validation
    if (packetID >= 101 && packetID <= 200) {
      List data = formatData(event);
      data = handleNegativesAndConvertToVolts(data);

      recordingData.values.add(data.sublist(0, 15));
      recordingData.values.add(data.sublist(15, 30));
    }
  }

  List formatData(event) {
    // Test event, comment scale factor
    // event = [ 101, 0, 0, 0, 0, 8, 0, 5, 0, 0, 72, 0, 9, 240, 1, 176, 0, 48, 0, 8]; // Positive Test
    // Expected [[0, 2, 10, 4], [262148, 507910, 393222, 8]]
    // event = [ 101, 255, 255, 191, 255, 239, 255, 252, 255, 255, 88, 0, 11, 62, 56, 224, 0, 63, 240, 1 ]; // Negative Test
    // Expected [[-3, -5, -7, -11], [-262139, -198429, -262137, -4095]]

    List data = getListForCSV();

    data[0] = recordingData.sampleCounter;
    data[1] = (event[1] << 11) | (event[2] << 3) | (event[3] >> 5);
    data[2] = ((event[3] & 31) << 14) | (event[4] << 6) | (event[5] >> 2);
    data[3] = ((event[5] & 3) << 17) |
        (event[6] << 9) |
        (event[7] << 1) |
        (event[8] >> 7);
    data[4] = ((event[8] & 127) << 12) | (event[9] << 4) | (event[10] >> 4);
    data[15] = recordingData.sampleCounter++;
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
    List data = new List(30);

    for (int i = 5; i < 15; ++i) {
      data[i] = 0;
      data[i + 15] = 0;
    }
    return data;
  }

  List handleNegativesAndConvertToVolts(data) {
    for (int i = 1; i < 5; ++i) {
      for (int j = 0; j < 2; ++j) {
        int offset = 15 * j;
        String binary = data[i + offset].toRadixString(2);

        if (binary[binary.length - 1] == '1') {
          data[i + offset] = (~data[i + offset] & 524287 | 1) * -1;
        }

        // Convert to microvolts using the scale factor
        data[i + offset] =
            data[i + offset].toDouble() * (1200000 / (8388607.0 * 1.5 * 51.0));
      }
    }

    return data;
  }
}
