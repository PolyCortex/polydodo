import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/aggregated_sleep_metrics.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/pages/dashboard/sliver_app_bar_title.dart';
import 'package:polydodo/src/presentation/widgets/loading_indicator.dart';
import 'package:polydodo/src/presentation/widgets/metric.dart';
import 'package:polydodo/src/presentation/widgets/sleep_efficiency_chart.dart';

class DashboardPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var _sleepHistoryCubit =
        BlocProvider.of<SleepSequenceHistoryCubit>(context);
    return BlocBuilder<SleepSequenceHistoryCubit, SleepSequenceHistoryState>(
        cubit: _sleepHistoryCubit,
        builder: (context, state) {
          return Scaffold(
            // appBar: AppBar(title: Text('Polydodo')),
            drawer: NavDrawer(activeTab: NavdrawerTab.Dashboard),
            body: NestedScrollView(
              headerSliverBuilder:
                  (BuildContext context, bool innerBoxIsScrolled) {
                return <Widget>[
                  SliverAppBar(
                    brightness: Brightness.dark,
                    expandedHeight: 200.0,
                    pinned: true,
                    floating: false,
                    title: SliverAppBarTitle(child: Text('Polydodo')),
                    flexibleSpace: FlexibleSpaceBar(
                      centerTitle: true,
                      background: Container(
                        child: Image.asset(
                          'common/assets/img/polydodo_sliverbar_3_e.png',
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),
                ];
              },
              body: (state is SleepSequenceHistoryLoaded) &&
                      state.history.isNotEmpty
                  ? DashboardMetrics(state)
                  : LoadingIndicator(),
            ),
          );
        });
  }
}

class DashboardMetrics extends StatelessWidget {
  final SleepSequenceHistoryLoaded state;

  DashboardMetrics(this.state);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.only(top: 15.0),
        child: Column(
          children: [
            Text(
              'Dashboard',
              style: TextStyle(
                fontSize: 25,
                fontWeight: FontWeight.bold,
                color: Color(0xff46426c),
              ),
            ),
            Container(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Metric(
                          'Last efficiency',
                          AggregatedSleepMetrics.getLastSequenceEfficiency(
                                  state.history) *
                              100,
                          unit: '%'),
                      Metric(
                          'Last latency',
                          AggregatedSleepMetrics.getLastSequenceLatency(
                              state.history),
                          unit: ' min'),
                    ],
                  ),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Metric(
                          'Average duration',
                          AggregatedSleepMetrics.getAverageSleepTime(
                              state.history)),
                      Metric(
                        'Average Latency',
                        AggregatedSleepMetrics.getAverageSleepLatency(
                            state.history),
                        unit: ' min',
                      ),
                      Metric(
                          'Average efficiency',
                          AggregatedSleepMetrics.getAverageSleepEffiency(
                                  state.history) *
                              100,
                          unit: '%'),
                    ],
                  )
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40.0)
                  .add(EdgeInsets.symmetric(vertical: 30)),
              child: Container(
                child: SleepEfficiencyChart(state.history),
                height: 260,
              ),
            ),
            //Text(AggregatedSleepMetrics.get(state.history).toString())
          ],
        ),
      ),
    );
  }
}
