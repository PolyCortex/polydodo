// EEGData can be extended later to add our metrics
import 'package:polydodo/src/domain/entity.dart';

class EEGData extends Entity {
  List<List> _values;
  int sampleCounter = 0;

  EEGData(id, this._values)
      : assert(_values != null),
        super(id);

  List<List> get values => _values;

  String get fileName => id.toString();
}
