import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_cubit.dart';
import 'package:polydodo/src/application/sleep_sequence_history/sleep_sequence_history_state.dart';

class HistoryAppBar extends StatelessWidget with PreferredSizeWidget {
  @override
  final Size preferredSize;

  HistoryAppBar({
    Key key,
  })  : preferredSize = Size.fromHeight(56.0),
        super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
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
      actions: <Widget>[
        BlocConsumer<SleepSequenceHistoryCubit, SleepSequenceHistoryState>(
          listener: (context, state) {},
          builder: (context, state) {
            return Padding(
                padding: EdgeInsets.only(top: 20.0, right: 20.0),
                child: GestureDetector(
                  onTap: () =>
                      BlocProvider.of<SleepSequenceHistoryCubit>(context)
                          .toggleSelectMode(),
                  child: Text(
                    (state is SleepSequenceHistoryEditInProgress)
                        ? 'Done'
                        : 'Select',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ));
          },
        )
      ],
    );
  }
}
