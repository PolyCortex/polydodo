import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/night_stats/night_stats_cubit.dart';
import 'package:polydodo/src/application/night_stats/night_stats_state.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/pages/night_stats_page/metric_section.dart';
import 'package:polydodo/src/presentation/pages/night_stats_page/sleep_stages_section.dart';
import 'package:intl/intl.dart';

// todo: Normalize information with website

class NightStatsPage extends StatelessWidget {
  final appBloc = AppPropertiesBloc();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          centerTitle: true,
          title: StreamBuilder<Object>(
              stream: appBloc.titleStream,
              initialData: 'Night Stat',
              builder: (context, snapshot) {
                return Text(
                  snapshot.data,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.indigo,
                  ),
                );
              }),
          iconTheme: IconThemeData(color: Colors.black),
          actions: <Widget>[
            Padding(
                padding: EdgeInsets.only(right: 20.0),
                child: GestureDetector(
                  onTap: () {/* todo: Add export */},
                  child: Icon(
                    Icons.share,
                    size: 26.0,
                  ),
                )),
          ],
        ),
        drawer: NavDrawerPage(),
        body: BlocConsumer<NightStatsCubit, NightStatsState>(
          listener: (context, state) {
            print(state.runtimeType);
          },
          builder: (context, state) {
            if (state is NightStatsLoaded) {
              appBloc.updateTitle(DateFormat.yMMMMd()
                  .add_jm()
                  .format(state.stats.recordingStart));

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

class AppPropertiesBloc {
  final StreamController<String> _title = StreamController<String>();

  Stream<String> get titleStream => _title.stream;

  void updateTitle(String newTitle) {
    _title.sink.add(newTitle);
  }

  void dispose() {
    _title.close();
  }
}
