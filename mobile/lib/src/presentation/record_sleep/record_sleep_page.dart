import 'package:flutter/material.dart';
import 'package:polydodo/src/presentation/navigation/appdrawer_page.dart';

class RecordSleepPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Sample Page')),
      drawer: NavDrawerPage(),
      body: Center(
        child: Text('Sample Page'),
      ),
    );
  }
}
