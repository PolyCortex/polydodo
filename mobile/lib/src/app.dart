import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'presentation/presentation.dart';
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
        home: BluetoothSelectorRoute(),
        initialRoute: BluetoothSelectorRoute.name,
        routes: {
          WalletsRoute.name: (context) => WalletsRoute(),
          BluetoothSelectorRoute.name: (context) => BluetoothSelectorRoute(),
        },
      ),
    );
  }
}
