import 'package:equatable/equatable.dart';
import 'package:polydodo/src/domain/settings/acquisition_board.dart';
import 'package:polydodo/src/domain/settings/sex.dart';

class Settings extends Equatable {
  final int age;
  final AcquisitionBoard board;
  final Sex sex;

  Settings({this.age, this.board, this.sex});

  @override
  List<Object> get props => [age, board, sex];

  Settings copyWith({int age, AcquisitionBoard board, Sex sex}) {
    return Settings(
        age: age ?? this.age, board: board ?? this.board, sex: sex ?? this.sex);
  }
}
