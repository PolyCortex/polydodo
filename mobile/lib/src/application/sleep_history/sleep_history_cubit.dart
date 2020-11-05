import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/domain/sleep_history/i_sleep_history_repository.dart';
import 'package:polydodo/src/domain/sleep_history/night_stats.dart';
import 'sleep_history_state.dart';

class SleepHistoryCubit extends Cubit<SleepHistoryState> {
  final ISleepHistoryRepository _sleepHistoryRepository;

  List<NightStats> _localHistory;
  StreamSubscription<List<NightStats>> _sleepHistoryStream;
  List<NightStats> _selectedNights;
  bool _selectMode = false;

  SleepHistoryCubit(this._sleepHistoryRepository)
      : super(SleepHistoryInitial()) {
    loadHistory();
  }

  void loadHistory() {
    _sleepHistoryRepository.initializeRepository();

    _sleepHistoryStream ??= _sleepHistoryRepository
        .watch()
        .asBroadcastStream()
        .listen((history) => {
              _localHistory = history,
              emit(SleepHistoryLoaded(history, _selectedNights))
            });
  }

  void viewNight(NightStats night) {
    _sleepHistoryRepository.viewNight(night);
  }

  void toggleSelectMode() {
    _selectMode = !_selectMode;

    _selectedNights = _selectMode ? [] : null;

    emit(SleepHistoryLoaded(_localHistory, _selectedNights));
  }

  void selectNight(NightStats night) {
    var idx = _selectedNights.indexOf(night);

    idx == -1 ? _selectedNights.add(night) : _selectedNights.remove(night);

    emit(SleepHistoryLoaded(_localHistory, _selectedNights));
  }

  void deleteSelected() {
    _sleepHistoryRepository.deleteNights(_selectedNights);
    toggleSelectMode();
  }
}
