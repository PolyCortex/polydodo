import 'package:polydodo/src/domain/acquisition_device/acquisition_device_type.dart';

import 'i_acquisition_device_controller.dart';
import 'sleep_sequence.dart';

abstract class ISleepSequenceRepository {
  List<SleepSequence> getAll();

  void store(SleepSequence sequence);

  void delete(List<SleepSequence> sequencesToDelete);

  IAcquisitionDeviceController acquire(AcquisitionDeviceType deviceType);

  Future<SleepSequence> analyze(SleepSequence sequence);
}
