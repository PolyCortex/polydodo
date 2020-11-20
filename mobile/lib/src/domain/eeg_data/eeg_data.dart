import 'package:polydodo/src/domain/entity.dart';

class EEGData extends Entity {
  final List<List> _values;
  final DateTime startTime;

  EEGData(id, this.startTime, this._values)
      : assert(_values != null),
        super(id);

  List<List> get values => _values;

  String get fileName => id.toString() + '.txt';
}
