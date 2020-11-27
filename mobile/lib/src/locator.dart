import 'package:get_it/get_it.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/device/device_selector_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_stats/sleep_sequence_stats_cubit.dart';
import 'package:polydodo/src/domain/acquisition_device/acquisition_device_locator_service.dart';
import 'package:polydodo/src/domain/sleep_sequence/i_sleep_sequence_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/serial_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/bluetooth_repository.dart';
import 'package:polydodo/src/infrastructure/sleep_sequence/sleep_sequence_repository.dart';

/// Private GetIt instance as we want all DI to be performed here in this file
final _serviceLocator = GetIt.asNewInstance();

void registerServices() {
  _serviceLocator.registerSingleton<AcquisitionDeviceLocatorService>(
      AcquisitionDeviceLocatorService(
          BluetoothRepository(), SerialRepository()));
  _serviceLocator
      .registerSingleton<ISleepSequenceRepository>(SleepSequenceRepository());
}

/// This function creates all the BlocProviders used in this app
List<BlocProvider> createBlocProviders() => [
      BlocProvider<DeviceSelectorCubit>(
        create: (context) => DeviceSelectorCubit(
          _serviceLocator.get<AcquisitionDeviceLocatorService>(),
        ),
      ),
      BlocProvider<SleepSequenceStatsCubit>(
          create: (context) => SleepSequenceStatsCubit()),
      BlocProvider<SleepSequenceCubit>(
        create: (context) => SleepSequenceCubit(
            _serviceLocator.get<AcquisitionDeviceLocatorService>(),
            _serviceLocator.get<ISleepSequenceRepository>(),
            BlocProvider.of<SleepSequenceStatsCubit>(context)),
      ),
      BlocProvider<SleepSequenceHistoryCubit>(
          create: (context) => SleepSequenceHistoryCubit(
              _serviceLocator.get<ISleepSequenceRepository>(),
              BlocProvider.of<SleepSequenceStatsCubit>(context))),
    ];
