import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

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
