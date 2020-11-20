import 'package:flutter/material.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_tabs.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';

class DashboardPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(title: Text('Polydodo')),
      drawer: NavDrawer(activeTab: NavdrawerTab.Dashboard),
      body: NestedScrollView(
        headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
          return <Widget>[
            SliverAppBar(
              backgroundColor: Color(3289693),
              brightness: Brightness.dark,
              expandedHeight: 200.0,
              floating: false,
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                centerTitle: true,
                background: Container(
                  child: Image.asset(
                    'common/assets/img/polydodo_sliverbar_3_e.png',
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),
          ];
        },
        body: Center(
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 50),
            child: Padding(
                padding: EdgeInsets.symmetric(vertical: 200),
                child: Text('Dashboard')),
          ),
        ),
      ),
    );
  }
}
