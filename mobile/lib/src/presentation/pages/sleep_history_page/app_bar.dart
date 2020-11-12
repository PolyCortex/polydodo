import 'package:flutter/material.dart';

Widget buildAppBar(var historyCubit) {
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
      Padding(
          padding: EdgeInsets.only(top: 20.0, right: 20.0),
          child: GestureDetector(
            onTap: () => historyCubit.toggleSelectMode(),
            child: _buildSelectButton(historyCubit),
          )),
    ],
  );
}

Widget _buildSelectButton(var historyCubit) {
  return StreamBuilder<Object>(
      stream: historyCubit.selectStream,
      initialData: 'Select',
      builder: (context, snapshot) {
        return Text(
          snapshot.data,
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        );
      });
}
