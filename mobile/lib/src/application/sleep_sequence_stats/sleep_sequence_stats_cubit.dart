import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'sleep_sequence_stats_state.dart';

class SleepSequenceStatsCubit extends Cubit<SleepSequenceStatsState> {
  final ISleepSequenceRepository _sleepHistoryRepository;
  final StreamController<String> _titleText =
      StreamController<String>.broadcast();

  SleepSequenceStatsCubit(this._sleepHistoryRepository)
      : super(SleepSequenceStatsInitial()) {
    _sleepHistoryRepository.getSelectedSleepSequence().listen(
        (sleepSequence) => {emit(SleepSequenceStatsLoaded(sleepSequence))});
  }

  void updateTitle(String id) {
    _titleText.add(id);
  }

  Stream<String> get titleStream => _titleText.stream;
}
