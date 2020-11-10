import 'package:bloc/bloc.dart';
import 'package:enum_to_string/enum_to_string.dart';
import 'package:equatable/equatable.dart';
import 'package:polydodo/src/common/constants.dart';
import 'package:polydodo/src/domain/settings/settings.dart';
import 'package:shared_preferences/shared_preferences.dart';

part 'settings_state.dart';

class SettingsCubit extends Cubit<SettingsState> {
  SharedPreferences prefs;

  SettingsCubit() : super(SettingsLoadInProgress()) {
    getSettings();
  }

  Future<void> getSettings() async {
    var prefs = (await SharedPreferences.getInstance());

    var settings = Settings(
      age: prefs.getInt(AGEKEY),
      board: AcquisitionBoard
          .values[(prefs.getInt(BOARDKEY)) ?? AcquisitionBoard.NotSet.index],
      sex: Sex.values[(prefs.getInt(SEXKEY)) ?? Sex.NotSet.index],
    );

    emit(SettingsLoadSuccess(settings));
  }

  Future<void> setSetting<T>(String settingKey, T setting) async {
    if (state is SettingsLoadSuccess) {
      var settingString = settingKey != AGEKEY
          ? EnumToString.convertToString(setting)
          : setting.toString();
      switch (settingKey) {
        case AGEKEY:
          var age = int.parse(settingString);
          emit(SettingsLoadSuccess(
            (state as SettingsLoadSuccess).settings.copyWith(age: age),
          ));
          await prefs.setInt(AGEKEY, age);
          break;
        case SEXKEY:
          var sex = EnumToString.fromString(Sex.values, settingString);
          emit(
            SettingsLoadSuccess(
              (state as SettingsLoadSuccess).settings.copyWith(sex: sex),
            ),
          );
          await prefs.setInt(SEXKEY, sex.index);
          break;
        case BOARDKEY:
          var board =
              EnumToString.fromString(AcquisitionBoard.values, settingString);
          emit(
            SettingsLoadSuccess(
              (state as SettingsLoadSuccess).settings.copyWith(board: board),
            ),
          );
          await prefs.setInt(BOARDKEY, board.index);
          break;

        default:
      }
    }
  }
}
