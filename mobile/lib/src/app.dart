import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'presentation/counter_route/counter_route.dart';
import 'locator.dart';
import 'theme.dart';

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    /// Cubits are provided globally down all of the context tree
    return MultiBlocProvider(
      providers: createBlocProviders(),
      child: MaterialApp(
        title: 'PolyDodo',
        theme: theme,
        home: CounterRoute(),
        initialRoute: CounterRoute.name,
        routes: {
          CounterRoute.name: (context) => CounterRoute(),
        },
      ),
    );
  }
}
