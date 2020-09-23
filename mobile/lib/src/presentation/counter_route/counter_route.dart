import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:polydodo/src/application/counter/counter_cubit.dart';

import 'counter_text.dart';

class CounterRoute extends StatelessWidget {
  static const name = 'counterRoute';

  CounterRoute({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Polydodo')),
      body: Center(
        child: CounterText(),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: <Widget>[
          FloatingActionButton(
            key: const Key('counterRoute_increment_fab'),
            child: const Icon(Icons.add),
            onPressed: () => BlocProvider.of<CounterCubit>(context).increment(),
          ),
          const SizedBox(height: 8),
          FloatingActionButton(
            key: const Key('counterRoute_decrement_fab'),
            child: const Icon(Icons.remove),
            onPressed: () => BlocProvider.of<CounterCubit>(context).decrement(),
          ),
        ],
      ),
    );
  }
}
