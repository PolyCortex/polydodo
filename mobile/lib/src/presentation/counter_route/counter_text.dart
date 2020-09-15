import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:polydodo/src/application/counter/counter_cubit.dart';

class CounterText extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CounterCubit, int>(
      builder: (context, state) {
        return Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text('You have pushed the button this many times:'),
            Text('$state', style: Theme.of(context).textTheme.headline2),
          ],
        );
      },
    );
  }
}
