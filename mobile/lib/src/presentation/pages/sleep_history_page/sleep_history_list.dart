import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

class HistoryList extends StatelessWidget {
  final state;

  HistoryList(this.state);

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
        itemCount: state.history.length,
        itemBuilder: (context, index) {
          return ItemCard(state, index);
        });
  }
}

class ItemCard extends StatelessWidget {
  final state;
  final int index;

  ItemCard(this.state, this.index);

  @override
  Widget build(BuildContext context) {
    final historyCubit = BlocProvider.of<SleepSequenceHistoryCubit>(context);

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
      trailing: Trailing(state, state.history[index]),
    ));
  }
}

class Trailing extends StatelessWidget {
  final state;
  final SleepSequence sleepSequence;

  Trailing(this.state, this.sleepSequence);

  @override
  Widget build(BuildContext context) {
    if (!(state is SleepSequenceHistoryEditInProgress)) {
      return Icon(Icons.navigate_next);
    }

    return state.selectedSleepSequences.contains(sleepSequence)
        ? Icon(Icons.check_circle_outline, color: Colors.blue)
        : Icon(Icons.check_circle_outline);
  }
}
