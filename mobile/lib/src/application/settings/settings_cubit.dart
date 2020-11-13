import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:polydodo/src/common/constants.dart';
import 'package:polydodo/src/domain/settings/i_settings_repository.dart';
import 'package:polydodo/src/domain/settings/settings.dart';

part 'settings_state.dart';

class SettingsCubit extends Cubit<SettingsState> {
  final ISettingsRepository _repository;

  SettingsCubit(this._repository) : super(SettingsLoadInProgress()) {
    getSettings();
  }

  Future<void> getSettings() async {
    var settings = {
      AGE_KEY: await _repository.getSetting(AGE_KEY),
      SERVER_URL_KEY: await _repository.getSetting(SERVER_URL_KEY) ?? 'Not Set',
      SEX_KEY:
          Sex.values[await _repository.getSetting(SEX_KEY)] ?? Sex.NotSet.index,
    };
    emit(SettingsLoadSuccess(settings));
  }

  Future<void> setSetting(String settingKey, dynamic settingValue) async {
    if (state is SettingsLoadSuccess) {
      await _repository.setSetting(settingKey, settingValue);
      emit(
        SettingsLoadSuccess(
            (state as SettingsLoadSuccess).copyWith(settingKey, settingValue)),
      );
    }
  }
}
