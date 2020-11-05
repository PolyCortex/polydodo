import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

Widget buildHistoryList(var context, var state, var historyCubit) {
  return ListView.builder(
      itemCount: state.history.length,
      itemBuilder: (context, index) {
        return _buildItemCard(context, state, historyCubit, index);
      });
}

Widget _buildItemCard(var context, var state, var historyCubit, var index) {
  var selectMode = state.selectedNights != null;

  return Card(
      child: ListTile(
    onTap: () => {
      if (selectMode)
        {
          historyCubit.selectNight(state.history[index]),
        }
      else
        {
          historyCubit.viewNight(state.history[index]),
          ExtendedNavigator.of(context).replace(Routes.nightStatsPage)
        }
    },
    title: Text(state.history[index].id.toString()),
    trailing: _buildTrailing(state, selectMode, state.history[index]),
  ));
}

Widget _buildTrailing(var state, var selectMode, var night) {
  if (selectMode) {
    return state.selectedNights.contains(night)
        ? Icon(
            Icons.check_circle_outline,
            color: Colors.blue,
          )
        : Icon(Icons.check_circle_outline);
  } else {
    return Icon(Icons.navigate_next);
  }
}
