import 'dart:async';

import 'package:polydodo/src/domain/eeg_data/i_eeg_data_transformer.dart';

class BaseTransformer<S, T> implements IEEGDataTransformer<S, T> {
  StreamController controller;
  StreamSubscription _subscription;
  bool cancelOnError;
  Stream<S> _stream;

  List lastSampleData;
  int sampleCounter;

  BaseTransformer({bool syncc: false, this.cancelOnError}) {
    controller = new StreamController<T>(
        onListen: _onListen,
        onCancel: _onCancel,
        onPause: () {
          _subscription.pause();
        },
        onResume: () {
          _subscription.resume();
        },
        sync: syncc);
  }

  BaseTransformer.broadcast({bool syncc: false, this.cancelOnError}) {
    controller = new StreamController<T>.broadcast(
        onListen: _onListen, onCancel: _onCancel, sync: syncc);
  }

  void reset() {
    lastSampleData = [0, 0, 0, 0, 0];
    sampleCounter = 0;
  }

  void _onListen() {
    reset();

    _subscription = _stream.listen(onData,
        onError: controller.addError,
        onDone: controller.close,
        cancelOnError: cancelOnError);
  }

  void _onCancel() {
    _subscription.cancel();
    _subscription = null;
  }

  void onData(S data) {
    controller.add(data);
  }

  @override
  Stream<T> bind(Stream<S> stream) {
    this._stream = stream;
    return controller.stream;
  }

  @override
  StreamTransformer<S, T> cast<S, T>() {
    return StreamTransformer.castFrom(this);
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
        if (isDelta) data[i + offset] = lastSampleData[i] - data[i + offset];

        lastSampleData[i] = data[i + offset];
      }
    }

    return data;
  }
}
