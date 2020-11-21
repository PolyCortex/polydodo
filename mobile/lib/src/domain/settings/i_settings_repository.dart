import 'package:polydodo/src/domain/settings/settings.dart';

abstract class ISettingsRepository {
  Future<Settings> read();

  Future<void> store(String settingKey, dynamic settingValue);
}
