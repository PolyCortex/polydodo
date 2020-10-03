import 'package:equatable/equatable.dart';

import '../unique_id.dart';

class AcquisitionDevice extends Equatable {
  final UniqueId id;
  final String name;
  final interface;

  AcquisitionDevice(this.id, this.name, this.interface);

  @override
  List<Object> get props => [id];
}
