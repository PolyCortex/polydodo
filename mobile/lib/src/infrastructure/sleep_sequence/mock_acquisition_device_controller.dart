import 'dart:async';

import 'package:polydodo/src/domain/acquisition_device/acquisition_device_type.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_acquisition_device_controller.dart';
import 'package:polydodo/src/domain/sleep_sequence/signal_result.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';
import 'package:polydodo/src/infrastructure/sleep_sequence/mock_data.dart';

class MockAcquisitionDeviceController implements IAcquisitionDeviceController {
  @override
  void setDeviceType(AcquisitionDeviceType deviceType) {}

  @override
  void startRecording(Stream<List<int>> stream) {}

  @override
  Future<SleepSequence> stopRecording() async {
    return mock_data[0];
  }

  @override
  void testSignal(Stream<List<int>> stream,
      Function(SignalResult, SignalResult, [Exception]) callback) {
    callback(SignalResult.good, SignalResult.good);
  }
}
