import 'package:equatable/equatable.dart';
import 'package:uuid/uuid.dart';

class UniqueId extends Equatable {
  final String _id;

  UniqueId() : _id = Uuid().v4();

  UniqueId.from(String unique)
      : assert(unique != null),
        _id = unique;

  String get() => _id;

  @override
  List<Object> get props => [_id];

  @override
  bool get stringify => true;
}
