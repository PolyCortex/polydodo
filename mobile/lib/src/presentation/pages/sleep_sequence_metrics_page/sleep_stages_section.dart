import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:percent_indicator/percent_indicator.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';

// todo: use sequence

class SleepStagesSection extends StatelessWidget {
  final SleepSequence sleepSequence;

  const SleepStagesSection(this.sleepSequence);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          PercentageBar('Awake', Colors.orange),
          PercentageBar('N1', Colors.blue[100]),
          PercentageBar('N2', Colors.blue[200]),
          PercentageBar('N3', Colors.blue[800]),
          PercentageBar('REM', Colors.purple[300])
        ],
      ),
    );
  }
}

class PercentageBar extends StatelessWidget {
  final String label;
  final Color color;
  PercentageBar(this.label, this.color);

  @override
  Widget build(BuildContext context) {
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
}
