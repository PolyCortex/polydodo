import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/eeg_data/data_cubit.dart';
import 'package:polydodo/src/application/eeg_data/data_states.dart';

class RecordingRoute extends StatelessWidget {
  static const name = 'recordingRoute';

  RecordingRoute({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text("Recording"),
      ),
      body: BlocConsumer<DataCubit, DataState>(
        listener: (context, state) {
          print(state.runtimeType);
        },
        builder: (context, state) {
          if (state is DataStateInitial)
            return Center(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    RaisedButton(
                      child: Text("Start"),
                      onPressed: () =>
                          BlocProvider.of<DataCubit>(context).startStreaming(),
                    ),
                  ]),
            );
          else
            return Center(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    RaisedButton(
                      child: Text("Stop"),
                      onPressed: () =>
                          BlocProvider.of<DataCubit>(context).stopStreaming(),
                    ),
                  ]),
            );
        },
      ),
    );
  }
}
