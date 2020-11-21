export 'sex.dart';

part 'sex.dart';
part 'acquisition_board.dart';

class Settings extends Equatable {
  final int age;
  final String serverAdress;
  final Sex sex;

  Settings({this.age, this.serverAdress, this.sex});

  @override
  List<Object> get props => [age, serverAdress, sex];

  Settings copyWith({int newAge, String newServerAdress, Sex newSex}) {
    return Settings(
        age: newAge ?? age,
        serverAdress: newServerAdress ?? serverAdress,
        sex: newSex ?? sex);
  }
}
