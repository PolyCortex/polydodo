import 'package:polydodo/src/domain/acquisition_device/device_type.dart';
import 'package:polydodo/src/domain/eeg_data/signal_result.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';

abstract class IEEGDataRepository {
  void initialize(DeviceType deviceType);
  void createRecordingFromStream(Stream<List<int>> stream);
  Future<SleepSequenceStats> stopRecordingFromStream();

  void testSignal(Stream<List<int>> stream,
      Function(SignalResult, SignalResult, [Exception]) callback);
  // todo: implement export and import
  void importData();
  void exportData();
}
