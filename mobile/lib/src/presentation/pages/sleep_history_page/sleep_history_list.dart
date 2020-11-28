import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_state.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

Widget buildHistoryList(var context, var state, var historyCubit) {
  return ListView.builder(
      itemCount: state.history.length,
      itemBuilder: (context, index) {
        return _buildItemCard(context, state, historyCubit, index);
      });
}

Widget _buildItemCard(var context, var state, var historyCubit, var index) {
  return Card(
      child: ListTile(
    onTap: () => {
      if (state is SleepSequenceHistoryEditInProgress)
        {
          historyCubit.toggleSelectSequenceForDeletion(state.history[index]),
        }
      else
        {
          historyCubit.loadSleepSequence(state.history[index]),
          ExtendedNavigator.of(context).push(Routes.sleepSequenceMetricsPage)
        }
    },
    title: Text(state.history[index].id.toString()),
    trailing: _buildTrailing(state, state.history[index]),
  ));
}

Widget _buildTrailing(var state, var sleepSequence) {
  if (!(state is SleepSequenceHistoryEditInProgress)) {
    return Icon(Icons.navigate_next);
  }

  print(state.selectedSleepSequences);

  return state.selectedSleepSequences.contains(sleepSequence)
      ? Icon(Icons.check_circle_outline, color: Colors.blue)
      : Icon(Icons.check_circle_outline);
}
