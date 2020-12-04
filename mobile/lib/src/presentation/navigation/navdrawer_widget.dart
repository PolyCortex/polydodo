import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

part 'navdrawer_tabs.dart';

class NavDrawer extends StatelessWidget {
  static const name = 'appDrawerRoute';
  final NavdrawerTab activeTab;

  const NavDrawer({
    Key key,
    @required this.activeTab,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Drawer(
        child: ListView(
          //padding: EdgeInsets.only(top: 45.0),
          children: <Widget>[
            SizedBox(
                height: 23,
                child: Container(
                  color: Color(0xff3c3665),
                )),
            _createHeader(),
            _createDrawerItem(
              icon: Icons.dashboard,
              text: 'Dashboard',
              route: Routes.dashboardPage,
              tab: NavdrawerTab.Dashboard,
              context: context,
            ),
            // Todo: find the real place for the device selector, up to debate
            _createDrawerItem(
              icon: Icons.bluetooth,
              text: 'Device selector',
              route: Routes.deviceSelectorPage,
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
            _createDrawerItem(
              icon: Icons.settings,
              text: 'Settings',
              route: Routes.settingsPage,
              tab: NavdrawerTab.Settings,
              context: context,
            ),
          ],
        ),
      ),
    );
  }

  Widget _createHeader() {
    return DrawerHeader(
      decoration: BoxDecoration(
        color: Color(0xff3c3665), //Color(3289693),
        image: DecorationImage(
          scale: 12,
          fit: BoxFit.contain,
          image: AssetImage('common/assets/img/Objets.png'),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          SizedBox(height: 112, child: Container()),
          Positioned(
              top: 140,
              left: 15.0,
              child: Text('Polydodo',
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 20.0,
                      fontWeight: FontWeight.w500))),
        ],
      ),
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
          Icon(icon,
              color: activeTab == tab ? Color(0xff46426c) : Colors.black),
          Padding(
            padding: EdgeInsets.only(left: 8.0),
            child: Text(
              text,
              style: TextStyle(
                fontSize: activeTab == tab ? 15 : 14,
              ),
            ),
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
