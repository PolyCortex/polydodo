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
      BOARDKEY: AcquisitionBoard
          .values[(prefs.getInt(BOARDKEY)) ?? AcquisitionBoard.NotSet.index],
      SEXKEY: Sex.values[(prefs.getInt(SEXKEY)) ?? Sex.NotSet.index],
    };
  }

  @override
  void setSetting(String settingKey, dynamic settingValue) {
    if (settingValue is int) {
      prefs.setInt(settingKey, settingValue);
    } else if (settingValue is double) {
      prefs.setDouble(settingKey, settingValue);
    } else if (settingValue is bool) {
      prefs.setBool(settingKey, settingValue);
    } else {
      // setting is an enum value
      prefs.setInt(settingKey, settingValue.index);
    }
  }
}
