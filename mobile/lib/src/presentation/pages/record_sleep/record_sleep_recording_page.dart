import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_acquisition_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_acquisition_states.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_tabs.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';
import 'package:polydodo/src/presentation/pages/record_sleep/record_sleep_analyzing_section.dart';
import 'package:polydodo/src/presentation/pages/record_sleep/record_sleep_start_section.dart';
import 'package:polydodo/src/presentation/pages/record_sleep/record_sleep_stop_section.dart';

class RecordSleepRecordingPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Record Sleep')),
      drawer: NavDrawer(activeTab: NavdrawerTab.RecordSleep),
      body: BlocConsumer<SleepSequenceAcquisitionCubit,
          SleepSequenceAcquisitionState>(
        listener: (context, state) {
          print(state.runtimeType);
        },
        builder: (context, state) {
          // todo: Do something with analyze failure or also go to recording ?
          if (state is SleepSequenceAcquisitionAnalyzeSuccessful) {
            ExtendedNavigator.of(context).push(Routes.sleepSequenceMetricsPage);
          }

          if (state is SleepSequenceAcquisitionTestSignalSuccess) {
            return buildStartSection(context);
          }
          if (state is SleepSequenceAcquisitionRecordInProgress) {
            return buildStopSection(context);
          }
          if (state is SleepSequenceAcquisitionAnalyzeInProgress) {
            return buildAnalyzeInProgress(context);
          }
          return Container();
        },
      ),
    );
  }
}
