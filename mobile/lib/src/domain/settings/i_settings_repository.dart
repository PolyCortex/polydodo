abstract class ISettingsRepository {
  Future<dynamic> getSetting(String key);

  Future<void> setSetting(String settingKey, dynamic settingValue);
}
