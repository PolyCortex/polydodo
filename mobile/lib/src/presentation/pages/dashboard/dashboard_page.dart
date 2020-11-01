import 'package:flutter/material.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';

class DashBoardPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Polydodo')),
      drawer: NavDrawerPage(),
      body: Center(
        child: Text('Allo'),
      ),
    );
  }
}
