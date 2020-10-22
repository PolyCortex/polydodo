import 'dart:async';

abstract class BaseOpenBCITransformer<S, T> implements StreamTransformer<S, T> {
  StreamController controller;
  StreamSubscription _subscription;
  bool cancelOnError;
  Stream<S> _stream;

  BaseOpenBCITransformer({bool synchronous: false, this.cancelOnError}) {
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

  BaseOpenBCITransformer.broadcast(
      {bool synchronous: false, this.cancelOnError}) {
    controller = new StreamController<T>.broadcast(
        onListen: _onListen, onCancel: _onCancel, sync: synchronous);
  }

  void reset();

  void onData(S data);

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
