import 'package:polydodo/src/common/settings_keys.dart' as settings_keys;
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
      age: _prefs.getInt(settings_keys.AGE),
      serverAddress:
          _prefs.getString(settings_keys.SERVER_ADDRESS) ?? 'Not Set',
      sex: Sex.values[(_prefs.getInt(settings_keys.SEX)) ?? Sex.NotSet.index],
    );
  }

  @override
  Future<Settings> store(Settings newSettings) async {
    await _prefs.setInt(settings_keys.AGE, newSettings.age);
    await _prefs.setInt(settings_keys.SERVER_ADDRESS, newSettings.age);
    await _prefs.setInt(settings_keys.SEX, newSettings.sex.index);

    return newSettings;
  }
}
