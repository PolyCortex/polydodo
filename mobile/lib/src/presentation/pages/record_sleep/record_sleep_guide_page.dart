import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/eeg_data/data_cubit.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

part 'record_sleep_recording_page.dart';
part 'record_sleep_validate_page.dart';

class RecordSleepGuidePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Record Sleep')),
      drawer: NavDrawerPage(),
      body: Center(
        child: Text('Record Sleep Guide'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          ExtendedNavigator.of(context).replace(Routes.recordSleepValidatePage);
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
