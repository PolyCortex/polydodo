import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/blocs.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_tabs.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

class RecordSleepGuidePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Record Sleep')),
      drawer: NavDrawer(activeTab: NavdrawerTab.RecordSleep),
      body: PageView(
        children: [
          Container(child: Center(child: Text('Record Sleep Guide'))),
          Container(child: Center(child: Text('Record Sleep next'))),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // todo: Place start validation at last page of guide or skip guide button
          BlocProvider.of<DataCubit>(context).startSignalValidation();
          ExtendedNavigator.of(context).replace(Routes.recordSleepValidatePage);
        },
        icon: Icon(Icons.radio_button_checked),
        label: Text('Record'),
      ),
    );
  }
}
