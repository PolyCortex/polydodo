import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_history/sleep_history_cubit.dart';
import 'package:polydodo/src/application/sleep_history/sleep_history_state.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_tabs.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

class SleepHistoryPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        shadowColor: Colors.transparent,
        centerTitle: true,
        iconTheme: IconThemeData(color: Colors.black),
        title: Text(
          'History',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.indigo,
          ),
        ),
      ),
      drawer: NavDrawer(activeTab: NavdrawerTab.SleepHistory),
      body: BlocConsumer<SleepHistoryCubit, SleepHistoryState>(
        listener: (context, state) {
          print(state.runtimeType);
        },
        builder: (context, state) {
          if (state is SleepHistoryLoaded) {
            return ListView.builder(
                itemCount: state.history.length,
                itemBuilder: (context, index) {
                  return Card(
                      child: ListTile(
                    onTap: () => {
                      BlocProvider.of<SleepHistoryCubit>(context)
                          .selectNight(state.history[index]),
                      ExtendedNavigator.of(context)
                          .replace(Routes.nightStatsPage)
                    },
                    title: Text(state.history[index].id.toString()),
                  ));
                });
          } else {
            return Container();
          }
        },
      ),
    );
  }
}
