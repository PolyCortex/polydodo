import 'package:polydodo/src/domain/settings/i_settings_repository.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsRepository extends ISettingsRepository {
  SharedPreferences _prefs;

  SettingsRepository();

  @override
  Future<dynamic> read(String key) async {
    _prefs = (await SharedPreferences.getInstance());
    return _prefs.get(key);
  }

  @override
  Future<void> store(String settingKey, dynamic settingValue) async {
    if (settingValue is int) {
      await _prefs.setInt(settingKey, settingValue);
    } else if (settingValue is double) {
      await _prefs.setDouble(settingKey, settingValue);
    } else if (settingValue is bool) {
      await _prefs.setBool(settingKey, settingValue);
    } else if (settingValue is String) {
      await _prefs.setString(settingKey, settingValue);
    } else {
      // setting is an enum value
      await _prefs.setInt(settingKey, settingValue.index);
    }
  }
}
