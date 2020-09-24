import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:polydodo/src/application/Bluetooth/bluetooth_cubit.dart';
import 'package:polydodo/src/domain/bluetooth/i_bluetooth_repository.dart';

import 'package:polydodo/src/domain/wallet/i_wallet_repository.dart';
import 'package:polydodo/src/infrastructure/mock_wallet_repository.dart';
import 'package:polydodo/src/infrastructure/bluetooth_repository.dart';

import 'application/wallets/wallets_cubit.dart';

/// Private GetIt instance as we want all DI to be performed here in this file
final _serviceLocator = GetIt.asNewInstance();

void registerServices() {
  _serviceLocator.registerSingleton<IWalletRepository>(MockWalletRepository());
  _serviceLocator
      .registerSingleton<IBluetoothRepository>(BluetoothRepository());
}

/// This function creates all the BlocProviders used in this app
List<BlocProvider> createBlocProviders() => [
      BlocProvider<WalletsCubit>(
        create: (context) => WalletsCubit(
          _serviceLocator.get<IWalletRepository>(),
        ),
      ),
      BlocProvider<BluetoothCubit>(
        create: (context) => BluetoothCubit(
          _serviceLocator.get<IBluetoothRepository>(),
        ),
      ),
    ];
