import 'package:flutter_bloc/flutter_bloc.dart';

import 'application/counter/counter_cubit.dart';

/// This function creates all the BlocProviders used in this app
List<BlocProvider> createBlocProviders() => [
      BlocProvider<CounterCubit>(
        create: (context) => CounterCubit(),
      ),
    ];
