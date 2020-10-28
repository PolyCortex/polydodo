import 'package:polydodo/src/infrastructure/constants.dart';
import 'baseOpenBCITransformer.dart';

class GanglionTransformer<S, T> extends BaseOpenBCITransformer<S, T> {
  List _lastSampleData = [0, 0, 0, 0, 0];
  int _sampleCounter = 0;

  GanglionTransformer.broadcast({bool synchronous = false, cancelOnError})
      : super.broadcast(synchronous: synchronous, cancelOnError: cancelOnError);

  @override
  void reset() {
    _lastSampleData = [0, 0, 0, 0, 0];
    _sampleCounter = 0;
  }

  @override
  void onData(S data) {
    var event = data as List;

    if (event.length != GANGLION_PACKET_SIZE) return;

    int packetID = event[0];

    if (packetID == 0) {
      var data = parseRaw(event);
      data = processData(data,
          nbSamples: 1, hasNegativeCompression: false, isDelta: false);

      controller.add(data.sublist(0, 15));
    } else if (packetID >= 101 && packetID <= 200) {
      var data = parse19Bit(event);
      data = processData(data,
          nbSamples: 2, hasNegativeCompression: true, isDelta: true);

      controller.add(data.sublist(0, 15));
      controller.add(data.sublist(15, 30));
    }
  }

  List parseRaw(event) {
    var data = getListForCSV();

    data[0] = _sampleCounter++;
    data[1] = (event[1] << 16) | (event[2] << 8) | event[3];
    data[2] = (event[4] << 16) | (event[5] << 8) | event[6];
    data[3] = (event[7] << 16) | (event[8] << 8) | event[9];
    data[4] = (event[10] << 16) | (event[11] << 8) | event[12];

    return data;
  }

  List parse19Bit(event) {
    var data = getListForCSV();

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

  List getListForCSV() =>
      List.generate(GANGLION_NUMBER_COLUMNS * 2, (index) => 0);

  List processData(List data,
      {int nbSamples, bool hasNegativeCompression, bool isDelta}) {
    var result = List.from(data);

    for (var i = 1; i < GANGLION_NUMBER_CHANNELS + 1; ++i) {
      for (var j = 0; j < nbSamples; ++j) {
        var offset = 15 * j;

        if (hasNegativeCompression) {
          result[i + offset] = handleNegative(result[i + offset]);
        }

        result[i + offset] = convertToMicrovolts(result[i + offset]);

        if (isDelta) {
          result[i + offset] = convertDeltaToData(i, result[i + offset]);
        }

        _lastSampleData[i] = result[i + offset];
      }
    }

    return result;
  }

  int handleNegative(int i) {
    var binary = i.toRadixString(2);

    return binary[binary.length - 1] == '1' ? (~i & 524287 | 1) * -1 : i;
  }

  double convertToMicrovolts(int i) {
    return i.toDouble() * (1200000 / (8388607.0 * 1.5 * 51.0));
  }

  double convertDeltaToData(int lastSampleIndex, double i) {
    return _lastSampleData[lastSampleIndex] - i;
  }
}
