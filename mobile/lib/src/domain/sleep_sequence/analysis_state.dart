import 'package:hive/hive.dart';

part 'analysis_state.g.dart'; // Name of the TypeAdapter that we will generate in the future

@HiveType(typeId: 2)
enum AnalysisState {
  @HiveField(0)
  analysis_failed,
  @HiveField(1)
  analysis_pending,
  @HiveField(2)
  analysis_successful,
}
