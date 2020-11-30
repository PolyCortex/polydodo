import 'dart:io';

import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:path_provider/path_provider.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_analysis_state.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_sleep_sequence.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_sleep_sequence_metadata.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_sleep_sequence_metrics.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_sleep_stage_type.dart';
import 'package:polydodo/src/infrastructure/hive_datastructures/hive_sleep_stage.dart';

import 'constants.dart';

Future<void> initDatabase() async {
  WidgetsFlutterBinding.ensureInitialized();
  var appDocDir = await getApplicationDocumentsDirectory();
  // _deleteDatabase(appDocDir);
  await Hive.initFlutter(appDocDir.path + HIVE_RELATIVE_LOCATION);
  _registerAdapters();
}

void _registerAdapters() {
  Hive.registerAdapter(HiveAnalysisStateAdapter());
  Hive.registerAdapter(HiveSleepSequenceMetricsAdapter());
  Hive.registerAdapter(HiveSleepSequenceMetadataAdapter());
  Hive.registerAdapter(HiveSleepStageTypeAdapter());
  Hive.registerAdapter(HiveSleepStageAdapter());
  Hive.registerAdapter(HiveSleepSequenceAdapter());
}

// For development purposes only. If you change a box's content and try to load
// the old box with old content it will crash so you need to delete everything
// to store the new content type.
// todo: Remove this function at the end ?
// ignore: unused_element
void _deleteDatabase(var appDocDir) {
  var hiveDb = Directory(appDocDir.path + HIVE_RELATIVE_LOCATION);
  hiveDb.delete(recursive: true);
}
