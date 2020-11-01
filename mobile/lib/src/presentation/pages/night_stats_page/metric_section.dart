import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

Widget metricSection = Container(
  child: Row(
    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
    children: [
      Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildMetric('Recording Start'),
          _buildMetric('Recording Time'),
          _buildMetric('Sleep Efficiency'),
          _buildMetric('WASO'),
          _buildMetric('REM Latency')
        ],
      ),
      Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildMetric('Recording End'),
          _buildMetric('Effective Sleep Time'),
          _buildMetric('Sleep Latency'),
          _buildMetric('Awakenings'),
          _buildMetric('Number of Transitions')
        ],
      )
    ],
  ),
);

Container _buildMetric(String label) {
  return Container(
    padding: const EdgeInsets.all(16),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(label, style: TextStyle(color: Colors.blue)),
        Text('Stats metric')
      ],
    ),
  );
}
