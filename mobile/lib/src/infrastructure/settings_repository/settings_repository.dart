import 'package:polydodo/src/domain/settings/i_settings_repository.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsRepository extends ISettingsRepository {
  SharedPreferences prefs;

  SettingsRepository();

  @override
  Future<dynamic> getSetting(String key) async {
    prefs = (await SharedPreferences.getInstance());
    return prefs.get(key);
  }

  @override
  Future<void> setSetting(String settingKey, dynamic settingValue) async {
    if (settingValue is int) {
      await prefs.setInt(settingKey, settingValue);
    } else if (settingValue is double) {
      await prefs.setDouble(settingKey, settingValue);
    } else if (settingValue is bool) {
      await prefs.setBool(settingKey, settingValue);
    } else if (settingValue is String) {
      await prefs.setString(settingKey, settingValue);
    } else {
      // setting is an enum value
      await prefs.setInt(settingKey, settingValue.index);
    }
  }
}
