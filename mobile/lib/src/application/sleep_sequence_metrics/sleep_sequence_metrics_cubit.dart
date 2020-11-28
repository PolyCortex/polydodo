import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';
import 'sleep_sequence_metrics_state.dart';

class SleepSequenceMetricsCubit extends Cubit<SleepSequenceMetricsState> {
  String titleText = '';

  SleepSequenceMetricsCubit() : super(SleepSequenceMetricsInitial());

  void loadSleepSequence(SleepSequence sleepSequence) {
    titleText = sleepSequence.id.toString();
    emit(SleepSequenceMetricsLoaded(sleepSequence));
  }
}
