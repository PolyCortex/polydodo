import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:percent_indicator/percent_indicator.dart';
import 'dart:ui';

Widget sleepStagesSection = Container(
  child: Column(
    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
    children: [
      _buildPercentageBar('Awake', Colors.orange),
      _buildPercentageBar('N1', Colors.blue[100]),
      _buildPercentageBar('N2', Colors.blue[200]),
      _buildPercentageBar('N3', Colors.blue[800]),
      _buildPercentageBar('REM', Colors.purple[300])
    ],
  ),
);

Container _buildPercentageBar(String label, Color color) {
  return Container(
    padding: const EdgeInsets.all(8),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(label, style: TextStyle(color: Colors.blue)),
                  Text('00:00:00')
                ])),
        LayoutBuilder(
            builder: (BuildContext context, BoxConstraints constraints) {
          return LinearPercentIndicator(
            width: constraints.maxWidth,
            lineHeight: 14.0,
            percent: 0.5,
            backgroundColor: Colors.grey,
            progressColor: color,
          );
        }),
      ],
    ),
  );
}
