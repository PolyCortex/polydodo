import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence_metrics/sleep_sequence_metrics_cubit.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';
import 'sleep_sequence_history_state.dart';

class SleepSequenceHistoryCubit extends Cubit<SleepSequenceHistoryState> {
  final ISleepSequenceRepository _sleepSequenceRepository;
  final SleepSequenceMetricsCubit _sleepSequenceStatsCubit;
  final StreamController<String> _selectText =
      StreamController<String>.broadcast();

  SleepSequenceHistoryCubit(
      this._sleepSequenceRepository, this._sleepSequenceStatsCubit)
      : super(SleepSequenceHistoryInitial()) {
    loadHistory();
  }

  void loadHistory() {
    emit(SleepSequenceHistoryLoaded(_sleepSequenceRepository.getAll()));
  }

  void loadSleepSequence(SleepSequence sequence) {
    _sleepSequenceStatsCubit.loadSleepSequence(sequence);
  }

  void toggleSelectMode() {
    if (state is SleepSequenceHistoryEditInProgress) {
      _disableSelection();
    } else {
      _enableSelection();
    }
  }

  void _enableSelection() {
    _selectText.add('Done');
    emit(SleepSequenceHistoryEditInProgress(
        _sleepSequenceRepository.getAll(), []));
  }

  void _disableSelection() {
    _selectText.add('Select');
    emit(SleepSequenceHistoryLoaded(_sleepSequenceRepository.getAll()));
  }

  void toggleSelectSequenceForDeletion(SleepSequence sequence) {
    var selectedSleepSequences =
        (state as SleepSequenceHistoryEditInProgress).selectedSleepSequences;

    if (selectedSleepSequences.contains(sequence)) {
      selectedSleepSequences.remove(sequence);
    } else {
      selectedSleepSequences.add(sequence);
    }

    emit(SleepSequenceHistoryEditInProgress(
        _sleepSequenceRepository.getAll(), selectedSleepSequences));
  }

  void deleteSelected() {
    _sleepSequenceRepository.delete(
        (state as SleepSequenceHistoryEditInProgress).selectedSleepSequences);
    _disableSelection();
  }

  Stream<String> get selectStream => _selectText.stream;
}
