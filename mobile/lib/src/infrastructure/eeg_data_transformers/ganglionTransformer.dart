import 'package:polydodo/src/infrastructure/constants.dart';
import 'baseTransformer.dart';

class GanglionTransformer<S, T> extends BaseTransformer<S, T> {
  List _lastSampleData;
  int _sampleCounter;

  GanglionTransformer.broadcast({bool synchronous: false, cancelOnError})
      : super.broadcast(synchronous: synchronous, cancelOnError: cancelOnError);

  void reset() {
    _lastSampleData = [0, 0, 0, 0, 0];
    _sampleCounter = 0;
  }

  void onData(S data) {
    List event = data as List;

    if (event.length != GANGLION_PACKET_SIZE) return;

    int packetID = event[0];

    if (packetID == 0) {
      List data = parseRaw(event);
      data = convertToMicrovolts(data, false);

      controller.add(data.sublist(0, 15));
    } else if (packetID >= 101 && packetID <= 200) {
      List data = parse19Bit(event);
      data = convertToMicrovolts(data, true);

      controller.add(data.sublist(0, 15));
      controller.add(data.sublist(15, 30));
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
    List data = List(GANGLION_NUMBER_COLUMNS * 2);

    for (int i = 1; i < GANGLION_EXTRA_COLUMNS + 1; ++i) {
      data[GANGLION_NUMBER_COLUMNS - i] = 0;
      data[GANGLION_NUMBER_COLUMNS - i + 15] = 0;
    }
    return data;
  }

  List convertToMicrovolts(List data, bool isDelta) {
    for (int i = 1; i < GANGLION_NUMBER_CHANNELS + 1; ++i) {
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
