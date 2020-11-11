import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:polydodo/src/application/device/device_selector_cubit.dart';
import 'package:polydodo/src/application/eeg_data/data_cubit.dart';
import 'package:polydodo/src/application/night_stats/night_stats_cubit.dart';
import 'package:polydodo/src/application/settings/settings_cubit.dart';
import 'package:polydodo/src/application/sleep_history/sleep_history_cubit.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/domain/eeg_data/i_eeg_data_repository.dart';
import 'package:polydodo/src/domain/settings/i_settings_repository.dart';
import 'package:polydodo/src/domain/sleep_history/i_sleep_history_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/acquisition_device_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/eeg_data_repository.dart';
import 'package:polydodo/src/infrastructure/settings_repository/settings_repository.dart';
import 'package:polydodo/src/infrastructure/sleep_history/sleep_history_repository.dart';

/// Private GetIt instance as we want all DI to be performed here in this file
final _serviceLocator = GetIt.asNewInstance();

void registerServices() {
  _serviceLocator.registerSingleton<IAcquisitionDeviceRepository>(
      AcquisitionDeviceRepository());
  _serviceLocator.registerSingleton<IEEGDataRepository>(EEGDataRepository());
  _serviceLocator
      .registerSingleton<ISleepHistoryRepository>(SleepHistoryRepository());
  _serviceLocator.registerSingleton<ISettingsRepository>(SettingsRepository());
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
      BlocProvider<SettingsCubit>(
        create: (context) =>
            SettingsCubit(_serviceLocator.get<ISettingsRepository>()),
      ),
      BlocProvider<SleepHistoryCubit>(
          create: (context) => SleepHistoryCubit(
              _serviceLocator.get<ISleepHistoryRepository>())),
      BlocProvider<NightStatsCubit>(
          create: (context) =>
              NightStatsCubit(_serviceLocator.get<ISleepHistoryRepository>())),
    ];
