abstract class ISettingsRepository {
  Future<Map<String, dynamic>> getSettings();

  void setSetting(String settingKey, dynamic settingValue);
}
