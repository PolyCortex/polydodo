import 'package:flutter/material.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/widgets/simple_line_chart.dart';

class DashBoardPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(title: Text('Polydodo')),
      drawer: NavDrawerPage(),
      body: NestedScrollView(
        headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
          return <Widget>[
            SliverAppBar(
              expandedHeight: 200.0,
              floating: false,
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                  centerTitle: false,
                  title: Text('Polydodo',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16.0,
                      )),
                  background: Image.network(
                    'https://images.pexels.com/photos/396547/pexels-photo-396547.jpeg?auto=compress&cs=tinysrgb&h=350',
                    fit: BoxFit.cover,
                  )),
            ),
          ];
        },
        body: Center(
          child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 50),
              child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 200),
                  child: SimpleLineChart.withSampleData())),
        ),
      ),
    );
  }
}
