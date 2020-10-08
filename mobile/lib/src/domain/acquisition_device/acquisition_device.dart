import 'package:equatable/equatable.dart';
import 'package:polydodo/src/domain/entity.dart';

import '../unique_id.dart';

class AcquisitionDevice extends Entity {
  final String name;

  AcquisitionDevice(
    id,
    this.name,
  ) : super(id);
}
