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
              Metric('Recording Start',
                  sleepSequence.metadata.sleepSequenceDateTimeRange.start),
              Metric('Recording Time',
                  sleepSequence.metadata.sleepSequenceDateTimeRange.duration),
              Metric('Sleep Efficiency', sleepSequence.metrics.sleepEfficiency),
              Metric('WASO', sleepSequence.metrics.waso),
              Metric('REM Latency', sleepSequence.metrics.remLatency)
            ],
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Metric('Recording End',
                  sleepSequence.metadata.sleepSequenceDateTimeRange.end),
              Metric('Effective Sleep Time',
                  sleepSequence.metrics.effectiveSleepTime),
              Metric('Sleep Latency', sleepSequence.metrics.sleepLatency),
              Metric('Awakenings', sleepSequence.metrics.awakenings),
              Metric('Number of Transitions', sleepSequence.metrics.shifts)
            ],
          )
        ],
      ),
    );
  }
}

class Metric extends StatelessWidget {
  final value;
  final String label;

  Metric(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    var formattedValue = value;

    if (value is DateTime) {
      formattedValue = formatTime(value);
    } else if (value is Duration) {
      formattedValue = formatDuration(value);
    }

    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(label, style: TextStyle(color: Colors.blue)),
          Text(formattedValue.toString())
        ],
      ),
    );
  }
}

String formatTime(DateTime t) => DateFormat('HH:mm:ss').format(t);

String formatDuration(Duration d) =>
    d.toString().split('.').first.padLeft(8, '0');
