import 'package:polydodo/src/domain/entity.dart';

class AcquisitionDevice extends Entity {
  final String name;

  AcquisitionDevice(
    id,
    this.name,
  ) : super(id);
}
