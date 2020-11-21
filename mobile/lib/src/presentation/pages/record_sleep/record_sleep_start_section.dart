import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/blocs.dart';

// todo: build start section
Widget buildStartSection(var context) {
  return Center(
    child:
        Column(mainAxisAlignment: MainAxisAlignment.center, children: <Widget>[
      RaisedButton(
        child: Text('Start'),
        onPressed: () => BlocProvider.of<DataCubit>(context).startStreaming(),
      )
    ]),
  );
}
