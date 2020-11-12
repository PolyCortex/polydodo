import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:polydodo/src/domain/settings/i_settings_repository.dart';

part 'settings_state.dart';

class SettingsCubit extends Cubit<SettingsState> {
  final ISettingsRepository _repository;

  SettingsCubit(this._repository) : super(SettingsLoadInProgress()) {
    getSettings();
  }

  Future<void> getSettings() async {
    var settings = await _repository.getSettings();
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
