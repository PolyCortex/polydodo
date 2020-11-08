import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/domain/sleep_history/i_sleep_history_repository.dart';
import 'night_stats_state.dart';

class NightStatsCubit extends Cubit<NightStatsState> {
  final ISleepHistoryRepository _sleepHistoryRepository;

  NightStatsCubit(this._sleepHistoryRepository)
      : super(NightStatsStateInitial()) {
    _sleepHistoryRepository
        .getSelectedNight()
        .listen((nightStat) => {emit(NightStatsLoaded(nightStat))});
  }
}
