import 'package:polydodo/src/domain/settings/settings.dart';

abstract class ISettingsRepository {
  Future<Settings> load();

  void store(String settingKey, dynamic settingValue);
}
