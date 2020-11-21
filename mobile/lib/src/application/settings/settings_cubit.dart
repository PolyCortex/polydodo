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
    await emit(SettingsLoadSuccess(await _repository.read()));
  }

  Future<void> setSetting(String settingKey, dynamic setting) async {
    if (state is SettingsLoadSuccess) {
      var settings = (state as SettingsLoadSuccess).settings;
      switch (settingKey) {
        case AGE_KEY:
          settings = settings.copyWith(age: setting);
          break;
        case SERVER_ADRESS_KEY:
          settings = settings.copyWith(serverAddress: setting);
          break;
        case SEX_KEY:
          settings = settings.copyWith(sex: setting);
          break;
      }
      emit(SettingsLoadSuccess(settings));
      await _repository.store(settingKey, setting);
    }
  }
}
