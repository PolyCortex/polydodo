import 'package:equatable/equatable.dart';
import 'package:polydodo/src/common/constants.dart';

part 'sex.dart';

class Settings extends Equatable {
  final int age;
  final String serverAddress;
  final Sex sex;

  factory Settings(
      {int age = 30, String serverAddress = '0.0.0.0', Sex sex = Sex.NotSet}) {
    if (age == null) throw ("L'âge ne peut pas être nul.");
    if (age < MIN_AGE || age > MAX_AGE) {
      throw ("L'âge doit être entre 12 et 125 ans.");
    }
    if (serverAddress == null) {
      throw ("L'adresse du serveur ne peut être nulle.");
    }
    if (!IP_ADDRESS_REGEX.hasMatch(serverAddress)) {
      throw ("L'adresse du serveur doit être une adresse de format IPv4.");
    }
    if (sex == null) throw ('Le sex ne peut être nul.');

    return Settings._internal(age, serverAddress, sex);
  }

  Settings._internal(this.age, this.serverAddress, this.sex);

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
