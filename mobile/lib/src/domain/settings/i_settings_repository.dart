abstract class ISettingsRepository {
  Future<dynamic> read(String key);

  Future<void> store(String settingKey, dynamic settingValue);
}
