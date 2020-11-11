import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:polydodo/src/domain/settings/i_settings_repository.dart';

part 'settings_state.dart';

class SettingsCubit extends Cubit<SettingsState> {
  ISettingsRepository _repository;

  SettingsCubit(repository) : super(SettingsLoadInProgress()) {
    getSettings();
  }

  Future<void> getSettings() async {
    var settings = await _repository.getSettings();
    emit(SettingsLoadSuccess(settings));
  }

  Future<void> setSetting(String settingKey, dynamic settingValue) async {
    if (state is SettingsLoadSuccess) {
      emit(
        SettingsLoadSuccess(
            (state as SettingsLoadSuccess).settings[settingKey] = settingValue),
      );
      _repository.setSetting(settingKey, settingValue);
      // var settingString = settingKey != AGEKEY
      //     ? EnumToString.convertToString(setting)
      //     : setting.toString();

      // switch (settingKey) {
      //   case AGEKEY:
      //     var age = int.parse(settingString);
      //     emit(SettingsLoadSuccess(
      //       (state as SettingsLoadSuccess).settings.copyWith(age),
      //     ));
      //     await prefs.setInt(AGEKEY, age);
      //     break;
      //   case SEXKEY:
      //     var sex = EnumToString.fromString(Sex.values, settingString);
      //     emit(
      //       SettingsLoadSuccess(
      //         (state as SettingsLoadSuccess).settings.copyWith(sex: sex),
      //       ),
      //     );
      //     await prefs.setInt(SEXKEY, sex.index);
      //     break;
      //   case BOARDKEY:
      //     var board =
      //         EnumToString.fromString(AcquisitionBoard.values, settingString);
      //     emit(
      //       SettingsLoadSuccess(
      //         (state as SettingsLoadSuccess).settings.copyWith(board: board),
      //       ),
      //     );
      //     await prefs.setInt(BOARDKEY, board.index);
      //     break;

      //   default:
      // }
    }
  }
}
