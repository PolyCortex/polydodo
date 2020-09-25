import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

import 'package:polydodo/src/domain/wallet/i_wallet_repository.dart';
import 'package:polydodo/src/infrastructure/mock_wallet_repository.dart';

import 'application/wallets/wallets_cubit.dart';

/// Private GetIt instance as we want all DI to be performed here in this file
final _serviceLocator = GetIt.asNewInstance();

void registerServices() {
  _serviceLocator.registerSingleton<IWalletRepository>(
    MockWalletRepository(),
  );
}

/// This function creates all the BlocProviders used in this app
List<BlocProvider> createBlocProviders() => [
      BlocProvider<WalletsCubit>(
        create: (context) => WalletsCubit(
          _serviceLocator.get<IWalletRepository>(),
        ),
      ),
    ];
