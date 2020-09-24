import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'presentation/wallets/wallets_route.dart';
import 'presentation/bluetooth_route/bluetooth_route.dart';
import 'locator.dart';
import 'theme.dart';

class App extends StatelessWidget {
  App() {
    registerServices();
  }

  @override
  Widget build(BuildContext context) {
    /// Cubits are provided globally down all of the context tree
    return MultiBlocProvider(
      providers: createBlocProviders(),
      child: MaterialApp(
        title: 'PolyDodo',
        theme: theme,
        home: BluetoothRoute(),
        initialRoute: BluetoothRoute.name,
        routes: {
          WalletsRoute.name: (context) => WalletsRoute(),
          BluetoothRoute.name: (context) => BluetoothRoute(),
        },
      ),
    );
  }
}
