import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/eeg_data/data_cubit.dart';
import 'package:polydodo/src/application/navdrawer/navdrawer_bloc.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

part 'record_sleep_recording_page.dart';
part 'record_sleep_validate_page.dart';

class RecordSleepGuidePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Record Sleep')),
      drawer: NavDrawer(activeTab: NavdrawerState.RecordSleep),
      body: PageView(
        children: [
          Container(child: Center(child: Text('Record Sleep Guide'))),
          Container(child: Center(child: Text('Record Sleep next'))),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ExtendedNavigator.of(context).replace(Routes.recordSleepValidatePage);
        },
        icon: Icon(Icons.radio_button_checked),
        label: Text('Record'),
      ),
    );
  }
}
