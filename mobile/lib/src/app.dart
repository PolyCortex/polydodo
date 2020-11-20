import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'database.dart';

import 'locator.dart';
import 'presentation/navigation/routes/router.gr.dart' as auto_router;
import 'theme.dart';

class App extends StatelessWidget {
  App() {
    init();
  }

  void init() async {
    await initDatabase();
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
      ),
    );
  }
}
