import 'package:polydodo/src/domain/unique_id.dart';

abstract class Entity {
  final UniqueId id;

  Entity(this.id) : assert(id != null);

  @override
  bool operator ==(other) => other.id == id;

  @override
  int get hashCode => id.hashCode;
}
