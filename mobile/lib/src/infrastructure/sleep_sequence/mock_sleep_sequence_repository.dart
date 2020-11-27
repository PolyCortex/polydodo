import 'dart:async';

import 'package:polydodo/src/domain/acquisition_device/acquisition_device_type.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_acquisition_device_controller.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';
import 'package:polydodo/src/infrastructure/sleep_sequence/mock_data.dart';

import 'mock_acquisition_device_controller.dart';

class MockSleepSequenceRepository implements ISleepSequenceRepository {
  final sequenceStreamController = StreamController<SleepSequenceStats>();
  final _acquisitionDeviceController = MockAcquisitionDeviceController();

  final List<SleepSequence> _sleepSequencesPersistency = [];

  MockSleepSequenceRepository() {
    _sleepSequencesPersistency.add(mock_data_1);

    _sleepSequencesPersistency.add(mock_data_2);
  }

  @override
  List<SleepSequence> getAll() => _sleepSequencesPersistency;

  @override
  void store(SleepSequence sequence) {
    _sleepSequencesPersistency.add(sequence);
  }

  @override
  void delete(List<SleepSequence> sequencesToDelete) {
    for (var sequence in sequencesToDelete) {
      _sleepSequencesPersistency.remove(sequence);
    }
  }

  @override
  IAcquisitionDeviceController acquire(AcquisitionDeviceType deviceType) =>
      _acquisitionDeviceController;

  @override
  Future<SleepSequence> analyze(SleepSequence sequence) async {
    return mock_data_1;
  }
}
