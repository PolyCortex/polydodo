import 'dart:math';

import 'package:polydodo/src/infrastructure/constants.dart';
import 'baseOpenBCITransformer.dart';

class CytonTransformer<S, T> extends BaseOpenBCITransformer<S, T> {
  List packet = List();

  CytonTransformer.broadcast({bool synchronous: false, cancelOnError})
      : super.broadcast(synchronous: synchronous, cancelOnError: cancelOnError);

  void reset() {
    packet.clear();
  }

  void onData(S data) {
    List event = data as List;

    for (var i in event) {
      if (packet.length == 0) {
        if (i != CYTON_HEADER) {
          print("Missing header byte");
          continue;
        }
      }
      packet.add(i);

      if (packet.length == CYTON_PACKET_SIZE) {
        if (packet[CYTON_PACKET_SIZE - 1] < CYTON_FOOTER_MINIMUM) {
          print("Invalid packet");
          packet.clear();
          continue;
        }

        List data = parsePacket(packet);

        packet.clear();

        data = processData(data, true);

        controller.add(data);
      }
    }
  }

  List parsePacket(List fullPacket) {
    List data = getListForCSV();

    data[0] = fullPacket[1];
    data[1] = (fullPacket[2] << 16) | (fullPacket[3] << 8) | fullPacket[4];
    data[2] = (fullPacket[5] << 16) | (fullPacket[6] << 8) | fullPacket[7];
    data[3] = (fullPacket[8] << 16) | (fullPacket[9] << 8) | fullPacket[10];
    data[4] = (fullPacket[11] << 16) | (fullPacket[12] << 8) | fullPacket[13];
    data[5] = (fullPacket[14] << 16) | (fullPacket[15] << 8) | fullPacket[16];
    data[6] = (fullPacket[17] << 16) | (fullPacket[18] << 8) | fullPacket[19];
    data[7] = (fullPacket[20] << 16) | (fullPacket[21] << 8) | fullPacket[22];
    data[8] = (fullPacket[23] << 16) | (fullPacket[24] << 8) | fullPacket[25];

    return data;
  }

  List getListForCSV() => List.generate(CYTON_NUMBER_COLUMNS, (index) => 0);

  List processData(List data, bool hasNegativeCompression) {
    List result = List.from(data);

    for (int i = 1; i < CYTON_NUMBER_CHANNELS + 1; ++i) {
      if (hasNegativeCompression) result[i] = handleNegative(result[i]);

      result[i] = convertToMicrovolts(result[i]);
    }

    return result;
  }

  int handleNegative(int i) {
    return ((i & 0x00800000) > 0)
        ? (i | 0xFFFFFFFFFF000000)
        : (i & 0x0000000000FFFFFF);
  }

  double convertToMicrovolts(int i) {
    return i.toDouble() * (4500000 / (24 * (pow(2, 23) - 1)));
  }
}
