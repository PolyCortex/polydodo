import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:polydodo/src/domain/settings/settings.dart';
import 'package:shared_preferences/shared_preferences.dart';

part 'settings_state.dart';

class SettingsCubit extends Cubit<SettingsState> {
  SharedPreferences prefs;

  SettingsCubit() : super(SettingsLoadInProgress()) {
    getSettings();
  }

  void getSettings() async {
    prefs = (await SharedPreferences.getInstance());

    var settings = Settings(
      age: prefs.getInt('age'),
      board: AcquisitionBoard
          .values[(prefs.getInt('board')) ?? AcquisitionBoard.Empty.index],
      sex: Sex.values[(prefs.getInt('sex')) ?? Sex.Empty.index],
    );

    emit(SettingsLoadSuccess(settings));
  }

  void setSex(Sex newSex) async {
    if (state is SettingsLoadSuccess) {
      emit(SettingsLoadSuccess(
          (state as SettingsLoadSuccess).settings.copyWith(sex: newSex)));
      await prefs.setInt('sex', newSex.index);
    }
  }

  void setAge(int newAge) async {
    if (state is SettingsLoadSuccess) {
      emit(SettingsLoadSuccess(
          (state as SettingsLoadSuccess).settings.copyWith(age: newAge)));
      await prefs.setInt('age', newAge);
    }
  }

  void setBoard(AcquisitionBoard newBoard) async {
    if (state is SettingsLoadSuccess) {
      emit(SettingsLoadSuccess(
          (state as SettingsLoadSuccess).settings.copyWith(board: newBoard)));
      await prefs.setInt('board', newBoard.index);
    }
  }
}
