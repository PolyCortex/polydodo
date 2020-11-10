part of 'settings_cubit.dart';

abstract class SettingsState extends Equatable {
  const SettingsState();

  @override
  List<Object> get props => [];
}

class SettingsLoadInProgress extends SettingsState {}

class SettingsLoadSuccess extends SettingsState {
  final Settings settings;

  const SettingsLoadSuccess(this.settings);

  @override
  List<Object> get props => [settings];

  @override
  String toString() => 'SettingsLoadSuccess { settings: $settings }';
}

class SettingsLoadFailure extends SettingsState {}
