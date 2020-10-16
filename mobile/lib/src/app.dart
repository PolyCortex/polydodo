import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/presentation/bluetooth_route/bluetoothSelector_route.dart';

import 'locator.dart';
import 'presentation/navigation/routes/router.gr.dart' as auto_router;
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
        builder: ExtendedNavigator.builder<auto_router.Router>(
            router: auto_router.Router()),
        /*home: WalletsRoute(),
        initialRoute: WalletsRoute.name,
        routes: {
          BluetoothSelectorRoute.name: (context) => BluetoothSelectorRoute(),
          WalletsRoute.name: (context) => WalletsRoute(), 
        }, */
      ),
    );
  }
}
