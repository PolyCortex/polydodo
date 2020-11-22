import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
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

  Future<void> setAge(int newAge) async {
    if (state is SettingsLoadSuccess) {
      emit(
        SettingsLoadSuccess(
          await _repository.store(
            (state as SettingsLoadSuccess).settings.copyWith(age: newAge),
          ),
        ),
      );
    }
  }

  Future<void> setSex(Sex newSex) async {
    if (state is SettingsLoadSuccess) {
      emit(
        SettingsLoadSuccess(
          await _repository.store(
            (state as SettingsLoadSuccess).settings.copyWith(sex: newSex),
          ),
        ),
      );
    }
  }

  Future<void> setServerAddress(String newServerAddress) async {
    if (state is SettingsLoadSuccess) {
      emit(
        SettingsLoadSuccess(
          await _repository.store(
            (state as SettingsLoadSuccess)
                .settings
                .copyWith(serverAddress: newServerAddress),
          ),
        ),
      );
    }
  }
}
