import 'package:polydodo/src/common/constants.dart';
import 'package:polydodo/src/domain/settings/i_settings_repository.dart';
import 'package:polydodo/src/domain/settings/settings.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsRepository extends ISettingsRepository {
  SharedPreferences prefs;

  SettingsRepository();

  @override
  Future<Map<String, dynamic>> getSettings() async {
    prefs = (await SharedPreferences.getInstance());
    return {
      AGEKEY: prefs.getInt(AGEKEY),
      SEXKEY: Sex.values[(prefs.getInt(SEXKEY)) ?? Sex.NotSet.index],
    };
  }

  @override
  Future<void> setSetting(String settingKey, dynamic settingValue) async {
    if (settingValue is int) {
      await prefs.setInt(settingKey, settingValue);
    } else if (settingValue is double) {
      await prefs.setDouble(settingKey, settingValue);
    } else if (settingValue is bool) {
      await prefs.setBool(settingKey, settingValue);
    } else {
      // setting is an enum value
      await prefs.setInt(settingKey, settingValue.index);
    }
  }
}
