import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:intl/intl.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';

class MetricSection extends StatelessWidget {
  final SleepSequence sleepSequence;

  MetricSection(this.sleepSequence);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildMetric('Recording Start',
                  sleepSequence.metadata.sleepSequenceDateTimeRange.start),
              _buildMetric('Recording Time',
                  sleepSequence.metadata.sleepSequenceDateTimeRange.duration),
              _buildMetric(
                  'Sleep Efficiency', sleepSequence.metrics.sleepEfficiency),
              _buildMetric('WASO', sleepSequence.metrics.waso),
              _buildMetric('REM Latency', sleepSequence.metrics.remLatency)
            ],
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildMetric('Recording End',
                  sleepSequence.metadata.sleepSequenceDateTimeRange.end),
              _buildMetric('Effective Sleep Time',
                  sleepSequence.metrics.effectiveSleepTime),
              _buildMetric('Sleep Latency', sleepSequence.metrics.sleepLatency),
              _buildMetric('Awakenings', sleepSequence.metrics.awakenings),
              _buildMetric(
                  'Number of Transitions', sleepSequence.metrics.shifts)
            ],
          )
        ],
      ),
    );
  }
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
