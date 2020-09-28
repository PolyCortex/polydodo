// EEGData can be extended later to add our metrics
class EEGData {
  String id;
  List<List> _values;
  int sampleCounter = 0;

  EEGData(this.id, this._values)
      : assert(id != null),
        assert(_values != null);

  List<List> get values => _values;

  String get fileName => id;
}
