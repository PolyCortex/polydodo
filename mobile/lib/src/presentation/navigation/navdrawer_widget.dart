import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

import 'navdrawer_tabs.dart';

class NavDrawer extends StatelessWidget {
  static const name = 'appDrawerRoute';
  final NavdrawerTab activeTab;

  const NavDrawer({
    Key key,
    @required this.activeTab,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.only(top: 45.0),
        children: <Widget>[
          _createHeader(),
          _createDrawerItem(
            icon: Icons.dashboard,
            text: 'Dashboard',
            route: Routes.dashboardPage,
            tab: NavdrawerTab.Dashboard,
            context: context,
          ),
          _createDrawerItem(
            icon: Icons.bluetooth,
            text: 'Bluetooth selector',
            route: Routes.bluetoothSelectorPage,
            tab: NavdrawerTab.BluetoothSelector,
            context: context,
          ),
          _createDrawerItem(
            icon: Icons.hotel,
            text: 'Record Sleep sequence',
            route: Routes.recordSleepGuidePage,
            tab: NavdrawerTab.RecordSleep,
            context: context,
          ),
          _createDrawerItem(
            icon: Icons.analytics,
            text: 'History',
            route: Routes.sleepHistoryPage,
            tab: NavdrawerTab.History,
            context: context,
          ),
        ],
      ),
    );
  }

  Widget _createHeader() {
    return DrawerHeader(
      margin: EdgeInsets.zero,
      padding: EdgeInsets.zero,
      decoration: BoxDecoration(
        color: Color(3289693),
        image: DecorationImage(
          scale: 15,
          fit: BoxFit.fitWidth,
          image: AssetImage('common/assets/img/Objets.png'),
        ),
      ),
      child: Stack(children: <Widget>[]),
    );
  }

  Widget _createDrawerItem(
      {IconData icon,
      String text,
      NavdrawerTab tab,
      String route,
      BuildContext context}) {
    return ListTile(
      title: Row(
        children: <Widget>[
          Icon(icon),
          Padding(
            padding: EdgeInsets.only(left: 8.0),
            child: Text(text),
          )
        ],
      ),
      onTap: () {
        ExtendedNavigator.of(context).popAndPush(route);
      },
      selected: activeTab == tab,
    );
  }
}
