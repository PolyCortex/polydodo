part of 'settings_cubit.dart';

abstract class SettingsState extends Equatable {
  const SettingsState();

  @override
  List<Object> get props => [];
}

class SettingsLoadInProgress extends SettingsState {}

class SettingsLoadSuccess extends SettingsState {
  final Map<String, dynamic> settings;

  const SettingsLoadSuccess(this.settings);

  @override
  List<Object> get props => [settings];

  @override
  String toString() => 'SettingsLoadSuccess { settings: $settings }';

  Map<String, dynamic> copyWith(String settingKey, dynamic settingValue) {
    var newSettings = Map<String, dynamic>.from(settings);
    newSettings[settingKey] = settingValue;
    return newSettings;
  }
}

class SettingsLoadFailure extends SettingsState {}
