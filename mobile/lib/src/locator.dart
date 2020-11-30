import 'package:get_it/get_it.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/device/device_selector_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_acquisition_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_metrics/sleep_sequence_metrics_cubit.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device_locator_service.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/serial_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/bluetooth_repository.dart';
import 'package:polydodo/src/infrastructure/sleep_sequence/sleep_sequence_repository.dart';

import 'infrastructure/settings_repository/settings_repository.dart';

/// Private GetIt instance as we want all DI to be performed here in this file
final _serviceLocator = GetIt.asNewInstance();

void registerServices() {
  _serviceLocator.registerSingleton<AcquisitionDeviceLocatorService>(
      AcquisitionDeviceLocatorService(
          BluetoothRepository(), SerialRepository()));
  _serviceLocator
      .registerSingleton<ISleepSequenceRepository>(SleepSequenceRepository());
  _serviceLocator.registerSingleton<ISettingsRepository>(SettingsRepository());
}

/// This function creates all the BlocProviders used in this app
List<BlocProvider> createBlocProviders() => [
      BlocProvider<DeviceSelectorCubit>(
        create: (context) => DeviceSelectorCubit(
          _serviceLocator.get<AcquisitionDeviceLocatorService>(),
        ),
      ),
      BlocProvider<SleepSequenceMetricsCubit>(
          create: (context) => SleepSequenceMetricsCubit()),
      BlocProvider<SleepSequenceAcquisitionCubit>(
        create: (context) => SleepSequenceAcquisitionCubit(
            _serviceLocator.get<AcquisitionDeviceLocatorService>(),
            _serviceLocator.get<ISleepSequenceRepository>(),
            BlocProvider.of<SleepSequenceMetricsCubit>(context)),
      ),
      BlocProvider<SleepSequenceHistoryCubit>(
          create: (context) => SleepSequenceHistoryCubit(
              _serviceLocator.get<ISleepSequenceRepository>(),
              BlocProvider.of<SleepSequenceMetricsCubit>(context))),
      BlocProvider<SettingsCubit>(
        create: (context) =>
            SettingsCubit(_serviceLocator.get<ISettingsRepository>()),
      ),
    ];
