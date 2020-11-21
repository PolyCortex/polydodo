import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/eeg_data/data_cubit.dart';
import 'package:polydodo/src/application/eeg_data/data_states.dart';
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
      body: BlocConsumer<DataCubit, DataState>(
        listener: (context, state) {
          print(state.runtimeType);
        },
        builder: (context, state) {
          if (state is DataStateAnalyzeSuccessful) {
            ExtendedNavigator.of(context).push(Routes.sleepSequenceStatsPage);
          }

          if (state is DataStateTestSignalSuccess) {
            return buildStartSection(context);
          }
          if (state is DataStateRecordInProgress) {
            return buildStopSection(context);
          }
          if (state is DataStateAnalyzeInProgress) {
            return buildAnalyzeInProgress(context);
          }
          return Container();
        },
      ),
    );
  }
}
