import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_acquisition_cubit.dart';

// todo: build stop section
Widget buildStopSection(BuildContext context) {
  return Center(
    child:
        Column(mainAxisAlignment: MainAxisAlignment.center, children: <Widget>[
      RaisedButton(
        child: Text('Stop'),
        onPressed: () => BlocProvider.of<SleepSequenceAcquisitionCubit>(context)
            .stopStreaming(),
      ),
    ]),
  );
}
