import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_state.dart';
import 'package:polydodo/src/domain/sleep_sequence/aggregated_sleep_metrics.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/pages/dashboard/sliver_app_bar_title.dart';
import 'package:polydodo/src/presentation/widgets/loading_indicator.dart';

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
                  ? Center(
                      child: Padding(
                        padding: EdgeInsets.symmetric(horizontal: 50),
                        child: Padding(
                          padding: EdgeInsets.symmetric(vertical: 200),
                          child: Column(
                            children: [
                              Text('Dashboard'),
                              Text(AggregatedSleepMetrics.getAverageSleepTime(
                                      state.history)
                                  .toString()),
                              //Text(AggregatedSleepMetrics.get(state.history).toString())
                            ],
                          ),
                        ),
                      ),
                    )
                  : LoadingIndicator(),
            ),
          );
        });
  }
}
