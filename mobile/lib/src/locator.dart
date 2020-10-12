import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:polydodo/src/application/device/device_selector_cubit.dart';
import 'package:polydodo/src/application/eeg_data/data_cubit.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/infrastructure/bluetooth_repository.dart';
import 'package:polydodo/src/infrastructure/serial_repository.dart';

import 'domain/eeg_data/i_eeg_data_repository.dart';
import 'infrastructure/eeg_data_repository.dart';

/// Private GetIt instance as we want all DI to be performed here in this file
final _serviceLocator = GetIt.asNewInstance();

void registerServices() {
  _serviceLocator
      .registerSingleton<IAcquisitionDeviceRepository>(BluetoothRepository());
  _serviceLocator.registerSingleton<IEEGDataRepository>(EEGDataRepository());
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
    ];
