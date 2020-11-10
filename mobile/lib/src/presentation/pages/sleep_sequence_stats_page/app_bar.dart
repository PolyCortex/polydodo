import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

Widget buildAppBar(var statsCubit) {
  return AppBar(
    backgroundColor: Colors.transparent,
    shadowColor: Colors.transparent,
    centerTitle: true,
    iconTheme: IconThemeData(color: Colors.black),
    title: StreamBuilder<Object>(
        stream: statsCubit.titleStream,
        initialData: 'Sleep Sequence Stat',
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
    leading: Builder(builder: (BuildContext context) {
      return IconButton(
        icon: Icon(Icons.arrow_back),
        onPressed: () => ExtendedNavigator.of(context).pop(),
      );
    }),
    actions: <Widget>[
      Padding(
          padding: EdgeInsets.only(right: 20.0),
          child: IconButton(
            onPressed: () {/* todo: Add export */},
            icon: Icon(
              Icons.share,
              size: 26.0,
            ),
          )),
    ],
  );
}
