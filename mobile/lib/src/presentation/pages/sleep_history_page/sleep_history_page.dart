import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_state.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_tabs.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/pages/sleep_history_page/app_bar.dart';
import 'package:polydodo/src/presentation/pages/sleep_history_page/sleep_history_list.dart';

class SleepHistoryPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocConsumer<SleepSequenceHistoryCubit, SleepSequenceHistoryState>(
        listener: (context, state) {},
        builder: (context, state) {
          return Scaffold(
              appBar: HistoryAppBar(),
              drawer: NavDrawer(activeTab: NavdrawerTab.History),
              body: (state is SleepSequenceHistoryLoaded ||
                      state is SleepSequenceHistoryEditInProgress)
                  ? HistoryList(state)
                  : Container(),
              floatingActionButton: HistoryFloatingActionButton(state));
        });
  }
}

class HistoryFloatingActionButton extends StatelessWidget {
  final state;

  HistoryFloatingActionButton(this.state);

  @override
  Widget build(BuildContext context) {
    return (state is SleepSequenceHistoryEditInProgress)
        ? Visibility(
            visible: (state.selectedSleepSequences?.isNotEmpty ?? false),
            child: FloatingActionButton(
              onPressed: () =>
                  BlocProvider.of<SleepSequenceHistoryCubit>(context)
                      .deleteSelected(),
              child: Icon(Icons.delete),
              backgroundColor: Colors.red,
            ))
        : Container();
  }
}
