import 'package:polydodo/src/domain/acquisition_device/device_type.dart';
import 'package:polydodo/src/domain/entity.dart';

class AcquisitionDevice extends Entity {
  final String name;
  final DeviceType deviceType;
  AcquisitionDevice(id, this.name, this.deviceType) : super(id);
}
