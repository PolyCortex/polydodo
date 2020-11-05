import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

Widget buildAppBar(var appBloc) {
  return AppBar(
    backgroundColor: Colors.transparent,
    shadowColor: Colors.transparent,
    centerTitle: true,
    iconTheme: IconThemeData(color: Colors.black),
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
  );
}
