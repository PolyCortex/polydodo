import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';
import 'sleep_sequence_stats_state.dart';

class SleepSequenceStatsCubit extends Cubit<SleepSequenceStatsState> {
  String titleText = '';

  SleepSequenceStatsCubit() : super(SleepSequenceStatsInitial());

  void loadSleepSequence(SleepSequenceStats sequence) {
    titleText = sequence.id.toString();
    emit(SleepSequenceStatsLoaded(sequence));
  }
}
