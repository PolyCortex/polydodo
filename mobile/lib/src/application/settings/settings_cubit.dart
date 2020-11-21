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
    await emit(SettingsLoadSuccess(await _repository.getSettings()));
  }

  Future<void> setSetting(String settingKey, dynamic setting) async {
    if (state is SettingsLoadSuccess) {
      var settings = (state as SettingsLoadSuccess).settings;
      switch (settingKey) {
        case AGEKEY:
          settings = settings.copyWith(newAge: setting);
          break;
        case SERVERADRESSKEY:
          settings = settings.copyWith(newServerAdress: setting);
          break;
        case SEXKEY:
          settings = settings.copyWith(newSex: setting);
          break;
      }
      emit(SettingsLoadSuccess(settings));
      await _repository.setSetting(settingKey, setting);
    }
  }
}
