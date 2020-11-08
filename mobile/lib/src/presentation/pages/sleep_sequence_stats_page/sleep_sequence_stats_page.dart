import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence_stats/sleep_sequence_stats_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_stats/sleep_sequence_stats_state.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_tabs.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/pages/sleep_sequence_stats_page/app_bar.dart';
import 'package:polydodo/src/presentation/pages/sleep_sequence_stats_page/metric_section.dart';
import 'package:polydodo/src/presentation/pages/sleep_sequence_stats_page/sleep_stages_section.dart';

// todo: Normalize information with website

class SleepSequenceStatsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var statsCubit = BlocProvider.of<SleepSequenceStatsCubit>(context);
    return Scaffold(
        appBar: buildAppBar(statsCubit),
        drawer: NavDrawer(activeTab: NavdrawerTab.SleepSequenceStats),
        body: BlocConsumer<SleepSequenceStatsCubit, SleepSequenceStatsState>(
          listener: (context, state) {
            print(state.runtimeType);
          },
          builder: (context, state) {
            if (state is SleepSequenceStatsLoaded) {
              statsCubit.updateTitle(state.stats.stringId);

              return SingleChildScrollView(
                child: Column(
                  children: [
                    buildMetricSection(state.stats),
                    buildSleepStagesSection(state.stats)
                  ],
                ),
              );
            } else {
              return Container();
            }
          },
        ));
  }
}
