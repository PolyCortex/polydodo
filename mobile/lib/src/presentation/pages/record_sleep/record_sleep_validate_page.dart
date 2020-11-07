import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/eeg_data/data_cubit.dart';
import 'package:polydodo/src/application/eeg_data/data_states.dart';
import 'package:polydodo/src/domain/eeg_data/signal_result.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_tabs.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';
import 'package:polydodo/src/presentation/pages/record_sleep/signal_section.dart';

class RecordSleepValidatePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        shadowColor: Colors.transparent,
        centerTitle: true,
        iconTheme: IconThemeData(color: Colors.black),
      ),
      drawer: NavDrawer(activeTab: NavdrawerTab.RecordSleep),
      body: BlocConsumer<DataCubit, DataState>(
        listener: (context, state) {
          print(state.runtimeType);
        },
        builder: (context, state) {
          return Center(
            child: Column(children: <Widget>[
              _buildValidationButton(context),
              buildSignalSection(state),
              if (state is DataStateTestSignalSuccess &&
                  state.channelOneResult == SignalResult.valid &&
                  state.channelTwoResult == SignalResult.valid)
                _buildNextButton(context),
            ]),
          );
        },
      ),
    );
  }
}

Widget _buildValidationButton(var context) {
  return ButtonTheme(
      minWidth: 200.0,
      height: 200.0,
      child: RaisedButton(
        onPressed: () => BlocProvider.of<DataCubit>(context).testSignal(),
        elevation: 2.0,
        color: Colors.white,
        child: Text('Validate Signal',
            style: TextStyle(color: Colors.blue, fontSize: 20.0)),
        shape: CircleBorder(),
      ));
}

Widget _buildNextButton(var context) {
  return Expanded(
      child: Align(
          alignment: Alignment.bottomRight,
          child: FlatButton(
              child: Text('Next',
                  style: TextStyle(color: Colors.blue, fontSize: 15.0)),
              onPressed: () => ExtendedNavigator.of(context)
                  .replace(Routes.recordSleepRecordingPage))));
}
