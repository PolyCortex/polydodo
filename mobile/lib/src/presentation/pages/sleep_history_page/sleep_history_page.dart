import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_history/sleep_history_cubit.dart';
import 'package:polydodo/src/application/sleep_history/sleep_history_state.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_tabs.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/pages/sleep_history_page/app_bar.dart';
import 'package:polydodo/src/presentation/pages/sleep_history_page/sleep_history_list.dart';

class SleepHistoryPage extends StatelessWidget {
  final appBloc = AppPropertiesBloc();

  @override
  Widget build(BuildContext context) {
    final historyCubit = BlocProvider.of<SleepHistoryCubit>(context);

    return Scaffold(
        appBar: buildAppBar(historyCubit, appBloc),
        drawer: NavDrawer(activeTab: NavdrawerTab.History),
        body: BlocConsumer<SleepHistoryCubit, SleepHistoryState>(
            listener: (context, state) {
          print(state.runtimeType);
        }, builder: (context, state) {
          if (state is SleepHistoryLoaded) {
            appBloc.updateSelectText(state.selectedNights != null);

            return buildHistoryList(context, state, historyCubit);
          } else {
            return Container();
          }
        }),
        floatingActionButton: _buildFloatingActionButton(historyCubit));
  }
}

class AppPropertiesBloc {
  final StreamController<String> _select = StreamController<String>();

  Stream<String> get selectStream => _select.stream;

  void updateSelectText(bool selectMode) {
    _select.sink.add(selectMode ? 'Done' : 'Select');
  }

  void dispose() {
    _select.close();
  }
}

Widget _buildFloatingActionButton(var historyCubit) {
  return BlocConsumer<SleepHistoryCubit, SleepHistoryState>(
      listener: (context, state) => {},
      builder: (context, state) {
        if (state is SleepHistoryLoaded) {
          return Visibility(
              visible: (state.selectedNights?.isNotEmpty ?? false),
              child: FloatingActionButton(
                onPressed: () => historyCubit.deleteSelected(),
                child: Icon(Icons.delete),
                backgroundColor: Colors.red,
              ));
        } else {
          return Container();
        }
      });
}
