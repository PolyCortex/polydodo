import 'package:equatable/equatable.dart';
import 'package:polydodo/src/common/constants.dart';

part 'sex.dart';

class Settings extends Equatable {
  final int age;
  final String serverAddress;
  final Sex sex;

  Settings(
      {this.age = 30, this.serverAddress = '0.0.0.0', this.sex = Sex.NotSet})
      : assert(age != null || (age == null && age > MIN_AGE && age < MAX_AGE)),
        assert(
            serverAddress != null || IP_ADDRESS_REGEX.hasMatch(serverAddress)),
        assert(sex != null);

  @override
  List<Object> get props => [age, serverAddress, sex];

  Settings copyWith({int age, String serverAddress, Sex sex}) {
    return Settings(
      age: age ?? this.age,
      serverAddress: serverAddress ?? this.serverAddress,
      sex: sex ?? this.sex,
    );
  }
}
