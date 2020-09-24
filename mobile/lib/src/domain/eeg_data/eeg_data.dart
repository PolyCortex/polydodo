class EEGData {
  String id;
  List<List> _values;
  int sampleCounter;

  EEGData() {
    this.id = DateTime.now().toString();
    sampleCounter = 0;
    initializeData();
  }

  void addValues(List<dynamic> value) {
    _values.add(value);
  }

  List<List> get values {
    return _values;
  }

  String get fileName {
    return id;
  }

  void initializeData() {
    _values = new List<List>();
    _values.add(["%OpenBCI Raw EEG Data"]);
    _values.add(["%Number of channels = 4"]);
    _values.add(["%Sample Rate = 200 Hz"]);
    _values.add(["%Board = OpenBCI_GUI\$BoardGanglionBLE"]);
    _values.add([
      "Sample Index",
      " EXG Channel 0",
      " EXG Channel 1",
      " EXG Channel 2",
      " EXG Channel 3",
      " Accel Channel 0",
      " Accel Channel 1",
      " Accel Channel 2",
      " Other",
      " Other",
      " Other",
      " Other",
      " Other",
      " Timestamp",
      " Timestamp (Formatted)"
    ]);
  }
}
