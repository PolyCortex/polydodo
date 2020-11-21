import 'package:polydodo/src/domain/settings/settings.dart';

abstract class ISettingsRepository {
  Future<Settings> getSettings();

  void setSetting(String settingKey, dynamic settingValue);
}
