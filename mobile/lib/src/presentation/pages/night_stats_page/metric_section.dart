import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:intl/intl.dart';
import 'package:polydodo/src/domain/sleep_history/night_stats.dart';

Container buildMetricSection(NightStats stats) {
  return Container(
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildMetric('Recording Start', stats.recordingStart),
            _buildMetric('Recording Time',
                stats.recordingEnd.difference(stats.recordingStart)),
            _buildMetric('Sleep Efficiency', stats.sleepEfficiency),
            _buildMetric('WASO', stats.waso),
            _buildMetric('REM Latency', stats.remLatency)
          ],
        ),
        Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildMetric('Recording End', stats.recordingEnd),
            _buildMetric('Effective Sleep Time', stats.effectiveSleepTime),
            _buildMetric('Sleep Latency', stats.sleepLatency),
            _buildMetric('Awakenings', stats.awakenings),
            _buildMetric('Number of Transitions', stats.numberTransitions)
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
