import 'package:equatable/equatable.dart';

part 'sex.dart';

class Settings extends Equatable {
  final int age;
  final String serverAddress;
  final Sex sex;

  Settings({this.age, this.serverAddress, this.sex});

  @override
  List<Object> get props => [age, serverAddress, sex];

  Settings copyWith({int age, String serverAddress, Sex sex}) {
    return Settings(
        age: age ?? this.age,
        serverAddress: serverAddress ?? this.serverAddress,
        sex: sex ?? this.sex);
  }
}
