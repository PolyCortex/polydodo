import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:polydodo/src/application/navdrawer/navdrawer_bloc.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

class NavDrawer extends StatelessWidget {
  static const name = 'appDrawerRoute';
  final NavdrawerState activeTab;

  const NavDrawer({
    Key key,
    @required this.activeTab,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<NavdrawerBloc, NavdrawerState>(
      builder: (b_context, drawerSelectedTab) {
        return Drawer(
          child: ListView(
            padding: EdgeInsets.zero, //only(top: 8.0),
            children: <Widget>[
              _createHeader(),
              _createDrawerItem(
                icon: Icons.dashboard,
                text: 'Dashboard',
                state: NavdrawerState.DashBoard,
                route: Routes.dashBoardPage,
                context: b_context,
              ),
              _createDrawerItem(
                icon: Icons.bluetooth,
                text: 'Bluetooth selector',
                state: NavdrawerState.BluetoothSelector,
                route: Routes.bluetoothSelectorPage,
                context: b_context,
              ),
              _createDrawerItem(
                icon: Icons.hotel,
                text: 'Record Sleep sequence',
                state: NavdrawerState.RecordSleep,
                route: Routes.recordSleepGuidePage,
                context: b_context,
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _createHeader() {
    return DrawerHeader(
        margin: EdgeInsets.zero,
        padding: EdgeInsets.zero,
        decoration: BoxDecoration(
            image: DecorationImage(
                fit: BoxFit.fill,
                image: AssetImage('common/assets/img/Material-Wallpaper.jpg'))),
        child: Stack(children: <Widget>[
          Positioned(
              bottom: 12.0,
              left: 16.0,
              child: Text('Polydodo',
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 20.0,
                      fontWeight: FontWeight.w500))),
        ]));
  }

  Widget _createDrawerItem(
      {IconData icon,
      String text,
      NavdrawerState state,
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
        //context.bloc<NavdrawerBloc>().add(NavdrawerUpdated(state));
        ExtendedNavigator.of(context).popAndPush(route);
        // ExtendedNavigator.of(context).replace(route);
      },
      selected: activeTab == state,
    );
  }
}
