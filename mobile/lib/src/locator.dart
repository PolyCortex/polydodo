import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:polydodo/src/application/navdrawer/navdrawer_bloc.dart';
import 'package:polydodo/src/application/device/device_selector_cubit.dart';
import 'package:polydodo/src/application/eeg_data/data_cubit.dart';
import 'package:polydodo/src/domain/acquisition_device/i_acquisition_device_repository.dart';
import 'package:polydodo/src/domain/eeg_data/i_eeg_data_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/acquisition_device_repository.dart';
import 'package:polydodo/src/infrastructure/connection_repositories/eeg_data_repository.dart';

/// Private GetIt instance as we want all DI to be performed here in this file
final _serviceLocator = GetIt.asNewInstance();

void registerServices() {
  // todo: dynamically change repository
  _serviceLocator.registerSingleton<IAcquisitionDeviceRepository>(
      AcquisitionDeviceRepository());
  _serviceLocator.registerSingleton<IEEGDataRepository>(EEGDataRepository());
}

/// This function creates all the BlocProviders used in this app
List<BlocProvider> createBlocProviders() => [
      BlocProvider<DeviceSelectorCubit>(
        create: (context) => DeviceSelectorCubit(
          _serviceLocator.get<IAcquisitionDeviceRepository>(),
        ),
      ),
      BlocProvider<NavdrawerBloc>(create: (context) => NavdrawerBloc()),
      BlocProvider<DataCubit>(
        create: (context) => DataCubit(
          _serviceLocator.get<IAcquisitionDeviceRepository>(),
          _serviceLocator.get<IEEGDataRepository>(),
        ),
      ),
    ];
