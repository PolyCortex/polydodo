import 'dart:io';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/navdrawer/navdrawer_bloc.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

class NavDrawerPage extends StatelessWidget {
  static const name = "appDrawerRoute";
  NavdrawerState drawerSelectedTab = NavdrawerState.DashBoard;
  BuildContext context;

  @override
  Widget build(BuildContext context) {
    this.context = context;
    return BlocBuilder<NavdrawerBloc, NavdrawerState>(
      builder: (context, drawerSelectedTab) {
        this.drawerSelectedTab = drawerSelectedTab;
        return Drawer(
          child: ListView(
            padding: EdgeInsets.zero, //only(top: 8.0),
            children: <Widget>[
              _createHeader(),
              _createDrawerItem(
                icon: Icons.dashboard,
                text: "Dashboard",
                state: NavdrawerState.DashBoard,
                route: Routes.dashBoardPage,
              ),
              _createDrawerItem(
                icon: Icons.bluetooth,
                text: "Bluetooth selector",
                state: NavdrawerState.BluetoothSelector,
                route: Routes.bluetoothSelectorPage,
              ),
              _createDrawerItem(
                icon: Icons.hotel,
                text: "Record Sleep sequence",
                state: NavdrawerState.RecordSleep,
                route: Routes.recordSleepGuidePage,
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
              child: Text("Polydodo",
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 20.0,
                      fontWeight: FontWeight.w500))),
        ]));
  }

  Widget _createDrawerItem(
      {IconData icon, String text, NavdrawerState state, String route}) {
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
        context.bloc<NavdrawerBloc>().add(NavdrawerUpdated(state));
        ExtendedNavigator.of(this.context).replace(route);
      },
      selected: this.drawerSelectedTab == state,
    );
  }
}
