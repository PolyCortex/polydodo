import 'package:polydodo/src/domain/acquisition_device/acquisition_device_type.dart';
import 'package:polydodo/src/domain/sleep_sequence/signal_result.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';

abstract class IAcquisitionDeviceController {
  void setDeviceType(AcquisitionDeviceType deviceType);

  void startRecording(Stream<List<int>> stream);

  Future<SleepSequence> stop();

  void testSignal(Stream<List<int>> stream,
      Function(SignalResult, SignalResult, [Exception]) callback);
}
