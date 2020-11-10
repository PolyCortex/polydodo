import 'package:flutter/material.dart';
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
              expandedHeight: 200.0,
              floating: false,
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                  centerTitle: true,
                  title: Text('Polydodo',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16.0,
                      )),
                  background: Image.asset(
                    'common/assets/img/Objets.png',
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
                child: Text('Dashboard')),
          ),
        ),
      ),
    );
  }
}
