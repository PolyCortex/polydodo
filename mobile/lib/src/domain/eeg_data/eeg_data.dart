// EEGData can be extended later to add our metrics
import 'package:polydodo/src/domain/domain.dart';

class EEGData {
  UniqueId id;
  List<List> _values;
  int sampleCounter = 0;

  EEGData(this.id, this._values)
      : assert(id != null),
        assert(_values != null);

  List<List> get values => _values;

  String get fileName => id.toString();
}
