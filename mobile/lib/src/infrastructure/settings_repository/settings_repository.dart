import 'package:polydodo/src/common/constants.dart';
import 'package:polydodo/src/domain/settings/i_settings_repository.dart';
import 'package:polydodo/src/domain/settings/settings.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsRepository extends ISettingsRepository {
  SharedPreferences _prefs;

  SettingsRepository();

  @override
  Future<Settings> read() async {
    _prefs = (await SharedPreferences.getInstance());

    return Settings(
      age: _prefs.getInt(AGE_KEY),
      serverAddress: _prefs.getString(SERVER_ADRESS_KEY) ?? 'Not Set',
      sex: Sex.values[(_prefs.getInt(SEX_KEY)) ?? Sex.NotSet.index],
    );
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
