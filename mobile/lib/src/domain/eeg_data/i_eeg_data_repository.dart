import 'package:polydodo/src/domain/eeg_data/signal_result.dart';

abstract class IEEGDataRepository {
  void initialize();
  void createRecordingFromStream(Stream<List<int>> stream);
  void stopRecordingFromStream();

  void testSignal(Stream<List<int>> stream,
      Function(SignalResult, SignalResult, [Exception]) callback);
  // todo: implement export and import
  void importData();
  void exportData();
}
