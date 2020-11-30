import 'package:polydodo/src/domain/acquisition_device/acquisition_device_type.dart';
import 'package:polydodo/src/domain/entity.dart';

class AcquisitionDevice extends Entity {
  final String name;
  final AcquisitionDeviceType deviceType;
  AcquisitionDevice(id, this.name, this.deviceType) : super(id);
}
