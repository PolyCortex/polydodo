abstract class ISettingsRepository {
  Future<Map<String, dynamic>> getSettings();

  Future<void> setSetting(String settingKey, dynamic settingValue);
}
