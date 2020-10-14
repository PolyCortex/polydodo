import 'dart:math';

import 'package:polydodo/src/infrastructure/constants.dart';
import 'baseOpenBCITransformer.dart';

class CytonTransformer<S, T> extends BaseOpenBCITransformer<S, T> {
  List packet;

  CytonTransformer.broadcast({bool synchronous: false, cancelOnError})
      : super.broadcast(synchronous: synchronous, cancelOnError: cancelOnError);

  void reset() {
    packet = new List();
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

        List data = parsePacket();

        data = convertToMicrovolts(data);

        controller.add(data);
      }
    }
  }

  List parsePacket() {
    List data = getListForCSV();

    data[0] = packet[1];
    data[1] = (packet[2] << 16) | (packet[3] << 8) | packet[4];
    data[2] = (packet[5] << 16) | (packet[6] << 8) | packet[7];
    data[3] = (packet[8] << 16) | (packet[9] << 8) | packet[10];
    data[4] = (packet[11] << 16) | (packet[12] << 8) | packet[13];
    data[5] = (packet[14] << 16) | (packet[15] << 8) | packet[16];
    data[6] = (packet[17] << 16) | (packet[18] << 8) | packet[19];
    data[7] = (packet[20] << 16) | (packet[21] << 8) | packet[22];
    data[8] = (packet[23] << 16) | (packet[24] << 8) | packet[25];

    packet.clear();
    return data;
  }

  List getListForCSV() {
    List data = List(CYTON_NUMBER_COLUMNS);

    for (int i = 1; i < CYTON_EXTRA_COLUMNS + 1; ++i) {
      data[CYTON_NUMBER_COLUMNS - i] = 0;
    }

    return data;
  }

  List convertToMicrovolts(List data) {
    for (int i = 1; i < CYTON_NUMBER_CHANNELS + 1; ++i) {
      // Convert to microvolts using the scale factor
      data[i] = data[i].toDouble() * (4500000 / (24 * (pow(2, 23) - 1)));
    }

    return data;
  }
}
