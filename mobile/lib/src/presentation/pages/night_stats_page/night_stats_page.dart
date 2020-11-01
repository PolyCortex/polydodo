import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';
import 'package:polydodo/src/presentation/pages/night_stats_page/metric_section.dart';
import 'package:polydodo/src/presentation/pages/night_stats_page/sleep_stages_section.dart';
import 'package:intl/intl.dart';

// todo: Normalize information with website

class NightStatsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: Text(
            DateFormat.yMMMMd().add_jm().format(DateTime.now()).toString(),
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.indigo,
            ),
          ),
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          iconTheme: new IconThemeData(color: Colors.black),
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
        body: SingleChildScrollView(
          child: Column(
            children: [metricSection, sleepStagesSection],
          ),
        ));
  }
}
