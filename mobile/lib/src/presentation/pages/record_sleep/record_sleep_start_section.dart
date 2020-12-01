import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_acquisition_cubit.dart';

// todo: build start section
Widget buildStartSection(BuildContext context) {
  return Center(
    child:
        Column(mainAxisAlignment: MainAxisAlignment.center, children: <Widget>[
      RaisedButton(
        child: Text('Start'),
        onPressed: () => BlocProvider.of<SleepSequenceAcquisitionCubit>(context)
            .startStreaming(),
      )
    ]),
  );
}
