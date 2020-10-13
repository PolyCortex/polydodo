import 'dart:async';

abstract class IEEGDataTransformer<S, T> implements StreamTransformer<S, T> {
  void reset();
  void onData(S data);
  Stream<T> bind(Stream<S> stream);
  IEEGDataTransformer.broadcast();
}
