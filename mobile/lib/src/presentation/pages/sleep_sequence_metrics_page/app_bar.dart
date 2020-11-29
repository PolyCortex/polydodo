import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence_metrics/sleep_sequence_metrics_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_metrics/sleep_sequence_metrics_state.dart';

class MetricAppBar extends StatelessWidget with PreferredSizeWidget {
  @override
  final Size preferredSize;

  MetricAppBar({
    Key key,
  })  : preferredSize = Size.fromHeight(56.0),
        super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      shadowColor: Colors.transparent,
      centerTitle: true,
      iconTheme: IconThemeData(color: Colors.black),
      title: BlocConsumer<SleepSequenceMetricsCubit, SleepSequenceMetricsState>(
        listener: (context, state) {},
        builder: (context, state) {
          return Text(
            (state is SleepSequenceMetricsLoaded)
                ? state.sleepSequence.id.toString()
                : 'Sleep Sequence',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.indigo,
            ),
          );
        },
      ),
      leading: IconButton(
        icon: Icon(Icons.arrow_back),
        onPressed: () => ExtendedNavigator.of(context).pop(),
      ),
      actions: <Widget>[
        Padding(
            padding: EdgeInsets.only(right: 20.0),
            child: IconButton(
              onPressed: () {/* todo: Add export */},
              icon: Icon(
                Icons.share,
                size: 26.0,
              ),
            )),
      ],
    );
  }
}
