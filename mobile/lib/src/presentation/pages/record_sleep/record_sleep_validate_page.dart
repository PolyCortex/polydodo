import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_acquisition_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_acquisition_states.dart';
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
      body: BlocConsumer<SleepSequenceAcquisitionCubit,
          SleepSequenceAcquisitionState>(
        listener: (context, state) {
          print(state.runtimeType);
        },
        builder: (context, state) {
          return Center(
            child: Column(children: <Widget>[
              _buildValidationCircle(context, state),
              buildSignalSection(state),
              if (state is SleepSequenceAcquisitionTestSignalSuccess)
                _buildNextButton(context),
            ]),
          );
        },
      ),
    );
  }
}

Widget _buildValidationCircle(
    BuildContext context, SleepSequenceAcquisitionState state) {
  return Center(
      child: Stack(alignment: Alignment.center, children: [
    SizedBox(width: 200, height: 200, child: _buildProgressIndicator(state)),
    _buildProgressIndicatorContent(state),
  ]));
}

Widget _buildProgressIndicator(SleepSequenceAcquisitionState state) {
  return (state is SleepSequenceAcquisitionTestSignalSuccess)
      ? CircularProgressIndicator(
          strokeWidth: 10,
          valueColor: AlwaysStoppedAnimation<Color>(Colors.green),
          value: 100,
        )
      : CircularProgressIndicator(
          strokeWidth: 10,
        );
}

Widget _buildProgressIndicatorContent(SleepSequenceAcquisitionState state) {
  return (state is SleepSequenceAcquisitionTestSignalSuccess)
      ? Icon(
          Icons.check,
          color: Colors.green,
          size: 50,
        )
      : Text(
          'Validating ...',
          style: TextStyle(fontWeight: FontWeight.bold),
        );
}

Widget _buildNextButton(BuildContext context) {
  return Expanded(
      child: Align(
          alignment: Alignment.bottomRight,
          child: FlatButton(
              child: Text('Next',
                  style: TextStyle(color: Colors.blue, fontSize: 15.0)),
              onPressed: () => ExtendedNavigator.of(context)
                  .replace(Routes.recordSleepRecordingPage))));
}
