import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pedantic/pedantic.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_states.dart';
import 'package:polydodo/src/application/sleep_sequence_stats/sleep_sequence_stats_cubit.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device_locator_service.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_acquisition_device_controller.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/signal_result.dart';

class SleepSequenceCubit extends Cubit<SleepSequenceState> {
  final AcquisitionDeviceLocatorService _deviceLocatorService;
  final ISleepSequenceRepository _sleepSequenceRepository;
  final SleepSequenceStatsCubit _sleepSequenceStatsCubit;

  IAcquisitionDeviceController _acquisitionDeviceController;

  SleepSequenceCubit(this._deviceLocatorService, this._sleepSequenceRepository,
      this._sleepSequenceStatsCubit)
      : super(SleepSequenceInitial());

  Future<void> startStreaming() async {
    emit(SleepSequenceRecordInProgress());

    _acquisitionDeviceController = _sleepSequenceRepository
        .acquire(_deviceLocatorService.getCurrentDeviceType());
    _acquisitionDeviceController
        .startRecording(await _deviceLocatorService.startDataStream());
  }

  void stopStreaming() async {
    emit(SleepSequenceAnalyzeInProgress());
    var sequence = await _acquisitionDeviceController.stop();
    var analyzedRecording = _sleepSequenceRepository.analyze(sequence);

    unawaited(analyzedRecording.then((sequence) {
      _sleepSequenceRepository.store(sequence);
      _sleepSequenceStatsCubit.loadSleepSequence(sequence);
      emit(SleepSequenceAnalyzeSuccessful());
    }));
  }

  Future<void> startSignalValidation() async {
    _acquisitionDeviceController = _sleepSequenceRepository
        .acquire(_deviceLocatorService.getCurrentDeviceType());
    _acquisitionDeviceController.testSignal(
        await _deviceLocatorService.startDataStream(), signalCallback);

    emit(SleepSequenceTestSignalInProgress(
        SignalResult.untested, SignalResult.untested));
  }

  void signalCallback(
      SignalResult fpzCzChannelResult, SignalResult pzOzChannelResult,
      [Exception e]) {
    if (e != null) {
      emit(SleepSequenceTestSignalFailure(e));
    } else if (fpzCzChannelResult == SignalResult.good &&
        pzOzChannelResult == SignalResult.good) {
      _acquisitionDeviceController.stop();
      emit(SleepSequenceTestSignalSuccess(
          fpzCzChannelResult, pzOzChannelResult));
    } else {
      emit(SleepSequenceTestSignalInProgress(
          fpzCzChannelResult, pzOzChannelResult));
    }
  }
}
