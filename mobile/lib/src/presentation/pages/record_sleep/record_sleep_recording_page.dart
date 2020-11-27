import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_states.dart';
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
      body: BlocConsumer<SleepSequenceCubit, SleepSequenceState>(
        listener: (context, state) {
          print(state.runtimeType);
        },
        builder: (context, state) {
          if (state is SleepSequenceAnalyzeSuccessful) {
            ExtendedNavigator.of(context).push(Routes.sleepSequenceStatsPage);
          }

          if (state is SleepSequenceTestSignalSuccess) {
            return buildStartSection(context);
          }
          if (state is SleepSequenceRecordInProgress) {
            return buildStopSection(context);
          }
          if (state is SleepSequenceAnalyzeInProgress) {
            return buildAnalyzeInProgress(context);
          }
          return Container();
        },
      ),
    );
  }
}
