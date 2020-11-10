import 'package:bloc/bloc.dart';
import 'package:polydodo/src/application/settings/settings_state.dart';
import 'package:polydodo/src/domain/settings/acquisition_board.dart';
import 'package:polydodo/src/domain/settings/sex.dart';
import 'package:polydodo/src/domain/settings/settings.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsCubit extends Cubit<SettingsState> {
  SettingsCubit() : super(SettingsLoadInProgress()) {
    getSettings();
  }

  void getSettings() async {
    var prefs = (await SharedPreferences.getInstance());

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
      await (await SharedPreferences.getInstance()).setInt('sex', newSex.index);
    }
  }

  void setAge(int newAge) async {
    if (state is SettingsLoadSuccess) {
      emit(SettingsLoadSuccess(
          (state as SettingsLoadSuccess).settings.copyWith(age: newAge)));
      await (await SharedPreferences.getInstance()).setInt('age', newAge);
    }
  }

  void setBoard(AcquisitionBoard newBoard) async {
    if (state is SettingsLoadSuccess) {
      emit(SettingsLoadSuccess(
          (state as SettingsLoadSuccess).settings.copyWith(board: newBoard)));
      await (await SharedPreferences.getInstance())
          .setInt('board', newBoard.index);
    }
  }
}
