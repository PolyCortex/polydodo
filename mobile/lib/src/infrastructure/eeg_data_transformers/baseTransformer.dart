import 'dart:async';

import 'package:polydodo/src/domain/eeg_data/i_eeg_data_transformer.dart';

class BaseTransformer<S, T> implements IEEGDataTransformer<S, T> {
  StreamController controller;
  StreamSubscription _subscription;
  bool cancelOnError;
  Stream<S> _stream;

  BaseTransformer({bool synchronous: false, this.cancelOnError}) {
    controller = new StreamController<T>(
        onListen: _onListen,
        onCancel: _onCancel,
        onPause: () {
          _subscription.pause();
        },
        onResume: () {
          _subscription.resume();
        },
        sync: synchronous);
  }

  BaseTransformer.broadcast({bool synchronous: false, this.cancelOnError}) {
    controller = new StreamController<T>.broadcast(
        onListen: _onListen, onCancel: _onCancel, sync: synchronous);
  }

  void reset() {}

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
}
