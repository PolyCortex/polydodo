import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:polydodo/src/application/eeg_data/data_cubit.dart';
import 'package:polydodo/src/domain/domain.dart';
import 'package:polydodo/src/infrastructure/eeg_data_repository.dart';
import 'package:polydodo/src/infrastructure/infrastructure.dart';
import 'application/application.dart';

/// Private GetIt instance as we want all DI to be performed here in this file
final _serviceLocator = GetIt.asNewInstance();

void registerServices() {
  _serviceLocator.registerSingleton<IWalletRepository>(MockWalletRepository());
  _serviceLocator
      .registerSingleton<IBluetoothRepository>(BluetoothRepository());
  _serviceLocator
      .registerSingleton<IEEGDataRepository>(EEGDataRepository());
}

/// This function creates all the BlocProviders used in this app
List<BlocProvider> createBlocProviders() => [
      BlocProvider<WalletsCubit>(
        create: (context) => WalletsCubit(
          _serviceLocator.get<IWalletRepository>(),
        ),
      ),
      BlocProvider<BluetoothSelectorCubit>(
        create: (context) => BluetoothSelectorCubit(
          _serviceLocator.get<IBluetoothRepository>(),
        ),
      ),
      BlocProvider<DataCubit>(
        create: (context) => DataCubit(
          _serviceLocator.get<IBluetoothRepository>(),
          _serviceLocator.get<IEEGDataRepository>(),
        ),
      ),
    ];
