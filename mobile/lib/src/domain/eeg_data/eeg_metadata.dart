// EEGData can be extended later to add our metrics

import 'package:polydodo/src/domain/unique_id.dart';

class EEGMetadata {
  final UniqueId id;
  final DateTime startTime;
  final DateTime endTime;
  bool analyzed = false;

  EEGMetadata(this.id, this.startTime, this.endTime)
      : assert(startTime != null),
        assert(endTime != null),
        assert(id != null);

  String get fileName => id.toString() + '.txt';

  List<Object> get props => [id];
}
