import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence_stats.dart';
import 'sleep_sequence_history_state.dart';

class SleepSequenceHistoryCubit extends Cubit<SleepSequenceHistoryState> {
  final ISleepSequenceRepository _sleepHistoryRepository;
  final StreamController<String> _selectText =
      StreamController<String>.broadcast();

  List<SleepSequenceStats> _selectedSequences;
  bool _selectMode = false;

  SleepSequenceHistoryCubit(this._sleepHistoryRepository)
      : super(SleepSequenceHistoryInitial()) {
    loadHistory();
  }

  void loadHistory() {
    emit(SleepSequenceHistoryLoaded(
        _sleepHistoryRepository.getSleepSequences()));
  }

  void selectSleepSequenceForViewing(SleepSequenceStats sequence) {
    _sleepHistoryRepository.selectSleepSequence(sequence);
  }

  void toggleSelectMode() {
    _selectMode = !_selectMode;

    if (_selectMode) {
      _enableSelection();
    } else {
      _disableSelection();
    }
  }

  void _enableSelection() {
    _selectedSequences = [];
    _selectText.add('Done');
    emit(SleepSequenceHistoryEditInProgress(
        _sleepHistoryRepository.getSleepSequences(), _selectedSequences));
  }

  void _disableSelection() {
    _selectedSequences = null;
    _selectText.add('Select');
    emit(SleepSequenceHistoryLoaded(
        _sleepHistoryRepository.getSleepSequences()));
  }

  void toggleSelectSequenceForDeletion(SleepSequenceStats sequence) {
    if (_selectedSequences.contains(sequence)) {
      _selectedSequences.remove(sequence);
    } else {
      _selectedSequences.add(sequence);
    }

    emit(SleepSequenceHistoryEditInProgress(
        _sleepHistoryRepository.getSleepSequences(), _selectedSequences));
  }

  void deleteSelected() {
    _sleepHistoryRepository.deleteSleepSequences(_selectedSequences);
    _disableSelection();
  }

  Stream<String> get selectStream => _selectText.stream;
}
