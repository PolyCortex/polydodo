import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence_metrics/sleep_sequence_metrics_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_metrics/sleep_sequence_metrics_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/analysis_state.dart';
import 'package:polydodo/src/presentation/pages/sleep_sequence_metrics_page/analysis_failure_section.dart';
import 'package:polydodo/src/presentation/pages/sleep_sequence_metrics_page/app_bar.dart';
import 'package:polydodo/src/presentation/pages/sleep_sequence_metrics_page/metric_section.dart';
import 'package:polydodo/src/presentation/pages/sleep_sequence_metrics_page/sleep_stages_section.dart';

// todo: Normalize information with website

class SleepSequenceMetricsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var statsCubit = BlocProvider.of<SleepSequenceMetricsCubit>(context);
    return Scaffold(
        appBar: buildAppBar(statsCubit),
        body:
            BlocConsumer<SleepSequenceMetricsCubit, SleepSequenceMetricsState>(
          listener: (context, state) {
            print(state.runtimeType);
          },
          builder: (context, state) {
            return StatsBody(state);
          },
        ));
  }
}

class StatsBody extends StatelessWidget {
  final state;

  StatsBody(this.state);

  @override
  Widget build(BuildContext context) {
    if (!(state is SleepSequenceMetricsLoaded)) {
      return Container();
    }

    if (state.sleepSequence.metadata.analysisState ==
        AnalysisState.analysis_failed) {
      return AnalysisFailure();
    }

    return SingleChildScrollView(
      child: Column(
        children: [
          MetricSection(state.sleepSequence),
          SleepStagesSection(state.sleepSequence)
        ],
      ),
    );
  }
}
