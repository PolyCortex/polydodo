import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';
import 'package:polydodo/src/presentation/widgets/metric.dart';

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
