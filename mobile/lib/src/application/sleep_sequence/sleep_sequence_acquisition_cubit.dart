import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_acquisition_states.dart';
import 'package:polydodo/src/application/sleep_sequence_metrics/sleep_sequence_metrics_cubit.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device_locator_service.dart';
import 'package:polydodo/src/domain/sleep_sequence/analysis_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_acquisition_device_controller.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/signal_result.dart';

class SleepSequenceAcquisitionCubit
    extends Cubit<SleepSequenceAcquisitionState> {
  final AcquisitionDeviceLocatorService _deviceLocatorService;
  final ISleepSequenceRepository _sleepSequenceRepository;
  final SleepSequenceMetricsCubit _sleepSequenceStatsCubit;

  IAcquisitionDeviceController _acquisitionDeviceController;

  SleepSequenceAcquisitionCubit(this._deviceLocatorService,
      this._sleepSequenceRepository, this._sleepSequenceStatsCubit)
      : super(SleepSequenceAcquisitionInitial());

  Future<void> startStreaming() async {
    emit(SleepSequenceAcquisitionRecordInProgress());

    _acquisitionDeviceController = _sleepSequenceRepository
        .acquire(_deviceLocatorService.getCurrentDeviceType());
    _acquisitionDeviceController
        .startRecording(await _deviceLocatorService.startDataStream());
  }

  void stopStreaming() async {
    emit(SleepSequenceAcquisitionRecordSuccess());
    final sleepSequence = await _acquisitionDeviceController.stopRecording();

    emit(SleepSequenceAcquisitionAnalyzeInProgress());
    final analyzedSleepSequence =
        await _sleepSequenceRepository.analyze(sleepSequence);

    _sleepSequenceRepository.store(analyzedSleepSequence);
    _sleepSequenceStatsCubit.loadSleepSequence(analyzedSleepSequence);
    (analyzedSleepSequence.metadata.analysisState ==
            AnalysisState.analysis_successful)
        ? emit(SleepSequenceAcquisitionAnalyzeSuccessful())
        : emit(SleepSequenceAcquisitionAnalyzeFailure());
  }

  Future<void> startSignalValidation() async {
    _acquisitionDeviceController = _sleepSequenceRepository
        .acquire(_deviceLocatorService.getCurrentDeviceType());
    _acquisitionDeviceController.testSignal(
        await _deviceLocatorService.startDataStream(), _signalCallback);

    emit(SleepSequenceAcquisitionTestSignalInProgress(
        SignalResult.untested, SignalResult.untested));
  }

  void _signalCallback(
      SignalResult fpzCzChannelResult, SignalResult pzOzChannelResult,
      [Exception e]) {
    if (e != null) {
      emit(SleepSequenceAcquisitionTestSignalFailure(e));
    } else if (fpzCzChannelResult == SignalResult.good &&
        pzOzChannelResult == SignalResult.good) {
      _acquisitionDeviceController.stopRecording();
      emit(SleepSequenceAcquisitionTestSignalSuccess(
          fpzCzChannelResult, pzOzChannelResult));
    } else {
      emit(SleepSequenceAcquisitionTestSignalInProgress(
          fpzCzChannelResult, pzOzChannelResult));
    }
  }
}
