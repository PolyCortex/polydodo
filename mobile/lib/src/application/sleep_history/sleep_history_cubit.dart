import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/domain/sleep_history/i_sleep_history_repository.dart';
import 'package:polydodo/src/domain/sleep_history/night_stats.dart';
import 'sleep_history_state.dart';

class SleepHistoryCubit extends Cubit<SleepHistoryState> {
  final ISleepHistoryRepository _sleepHistoryRepository;

  StreamSubscription<List<NightStats>> _sleepHistoryStream;
  // todo: remove this variable, also test that switch works correctly once UI is done
  bool usingBluetooth = true;

  SleepHistoryCubit(this._sleepHistoryRepository)
      : super(SleepHistoryInitial()) {
    loadHistory();
  }

  void loadHistory() {
    _sleepHistoryRepository.initializeRepository();

    _sleepHistoryStream ??= _sleepHistoryRepository
        .watch()
        .asBroadcastStream()
        .listen((history) => emit(SleepHistoryLoaded(history)));
  }

  void selectNight(NightStats night) {
    _sleepHistoryRepository.selectNight(night);
  }
}
