import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:path_provider/path_provider.dart';
import 'package:polydodo/src/domain/sleep_sequence/hive_sleep_sequence_stats.dart';

Future<void> initDatabase() async {
  WidgetsFlutterBinding.ensureInitialized();
  var appDocDir = await getApplicationDocumentsDirectory();
  await Hive.initFlutter(appDocDir.path + '/hive');
  Hive.registerAdapter(HiveSleepSequenceStatsAdapter());
}
