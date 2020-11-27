import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:intl/intl.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';

Container buildMetricSection(SleepSequence sequence) {
  return Container(
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildMetric(
                'Recording Start', sequence.metadata.sequenceDuration.start),
            _buildMetric(
                'Recording Time', sequence.metadata.sequenceDuration.duration),
            _buildMetric('Sleep Efficiency', sequence.stats.sleepEfficiency),
            _buildMetric('WASO', sequence.stats.waso),
            _buildMetric('REM Latency', sequence.stats.remLatency)
          ],
        ),
        Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildMetric(
                'Recording End', sequence.metadata.sequenceDuration.end),
            _buildMetric(
                'Effective Sleep Time', sequence.stats.effectiveSleepTime),
            _buildMetric('Sleep Latency', sequence.stats.sleepLatency),
            _buildMetric('Awakenings', sequence.stats.awakenings),
            _buildMetric(
                'Number of Transitions', sequence.stats.numberTransitions)
          ],
        )
      ],
    ),
  );
}

Container _buildMetric(String label, var value) {
  if (value is DateTime) {
    value = formatTime(value);
  } else if (value is Duration) {
    value = formatDuration(value);
  }

  return Container(
    padding: const EdgeInsets.all(16),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(label, style: TextStyle(color: Colors.blue)),
        Text(value.toString())
      ],
    ),
  );
}

String formatTime(DateTime t) => DateFormat('HH:mm:ss').format(t);

String formatDuration(Duration d) =>
    d.toString().split('.').first.padLeft(8, '0');
