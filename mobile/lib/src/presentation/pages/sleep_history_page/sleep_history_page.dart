import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_state.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/pages/sleep_history_page/app_bar.dart';
import 'package:polydodo/src/presentation/pages/sleep_history_page/sleep_history_list.dart';

class SleepHistoryPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final historyCubit = BlocProvider.of<SleepSequenceHistoryCubit>(context);

    return Scaffold(
        appBar: buildAppBar(historyCubit),
        drawer: NavDrawer(activeTab: NavdrawerTab.History),
        body:
            BlocConsumer<SleepSequenceHistoryCubit, SleepSequenceHistoryState>(
                listener: (context, state) {
          print(state.runtimeType);
        }, builder: (context, state) {
          return (state is SleepSequenceHistoryLoaded ||
                  state is SleepSequenceHistoryEditInProgress)
              ? buildHistoryList(context, state, historyCubit)
              : Container();
        }),
        floatingActionButton: _buildFloatingActionButton(historyCubit));
  }
}

Widget _buildFloatingActionButton(var historyCubit) {
  return BlocConsumer<SleepSequenceHistoryCubit, SleepSequenceHistoryState>(
      listener: (context, state) => {},
      builder: (context, state) {
        return (state is SleepSequenceHistoryEditInProgress)
            ? Visibility(
                visible: (state.selectedSequences?.isNotEmpty ?? false),
                child: FloatingActionButton(
                  onPressed: () => historyCubit.deleteSelected(),
                  child: Icon(Icons.delete),
                  backgroundColor: Colors.red,
                ))
            : Container();
      });
}
