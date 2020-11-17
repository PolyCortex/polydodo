import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:polydodo/src/application/device/device_selector_cubit.dart';
import 'package:polydodo/src/application/eeg_data/data_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_stats/sleep_sequence_stats_cubit.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/domain/eeg_data/i_eeg_data_repository.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/acquisition_device_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/eeg_data_repository.dart';
import 'package:polydodo/src/infrastructure/sleep_history/sleep_squence_repository.dart';

/// Private GetIt instance as we want all DI to be performed here in this file
final _serviceLocator = GetIt.asNewInstance();

void registerServices() {
  _serviceLocator.registerSingleton<IAcquisitionDeviceRepository>(
      AcquisitionDeviceRepository());
  _serviceLocator.registerSingleton<IEEGDataRepository>(EEGDataRepository());
  _serviceLocator
      .registerSingleton<ISleepSequenceRepository>(SleepSequenceRepository());
}

/// This function creates all the BlocProviders used in this app
List<BlocProvider> createBlocProviders() => [
      BlocProvider<DeviceSelectorCubit>(
        create: (context) => DeviceSelectorCubit(
          _serviceLocator.get<IAcquisitionDeviceRepository>(),
        ),
      ),
      BlocProvider<DataCubit>(
        create: (context) => DataCubit(
          _serviceLocator.get<IAcquisitionDeviceRepository>(),
          _serviceLocator.get<IEEGDataRepository>(),
        ),
      ),
      BlocProvider<SleepSequenceStatsCubit>(
          create: (context) => SleepSequenceStatsCubit()),
      BlocProvider<SleepSequenceHistoryCubit>(
          create: (context) => SleepSequenceHistoryCubit(
              _serviceLocator.get<ISleepSequenceRepository>(),
              BlocProvider.of<SleepSequenceStatsCubit>(context))),
    ];
