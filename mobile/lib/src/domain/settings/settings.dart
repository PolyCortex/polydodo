import 'package:equatable/equatable.dart';
import 'package:polydodo/src/common/constants.dart';

part 'sex.dart';

class Settings extends Equatable {
  final int age;
  final String serverAddress;
  final Sex sex;

  factory Settings({int age, String serverAddress, Sex sex}) {
    age = age ?? DEFAULT_AGE;
    serverAddress = serverAddress ?? DEFAULT_SERVER_ADDRESS;
    sex = sex ?? Sex.NotSet;
    if (age < MIN_AGE || age > MAX_AGE) {
      throw AgeNotInValidIntervalException(
          "L'âge configuré doit être entre 12 et 125 ans.");
    }

    if (!IP_ADDRESS_REGEX.hasMatch(serverAddress)) {
      throw InvalidIPAddressException(
          "L'adresse du serveur configurée doit être une adresse de format IPv4.");
    }

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

class InvalidIPAddressException implements Exception {
  String cause;
  InvalidIPAddressException(this.cause);
}

class AgeNotInValidIntervalException implements Exception {
  String cause;
  AgeNotInValidIntervalException(this.cause);
}
