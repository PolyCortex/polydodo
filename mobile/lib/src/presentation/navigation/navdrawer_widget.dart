import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/navdrawer/navdrawer_bloc.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

class NavDrawerPage extends StatelessWidget {
  static const name = 'appDrawerRoute';

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero, //only(top: 8.0),
        children: <Widget>[
          _createHeader(),
          _createDrawerItem(
            icon: Icons.bluetooth,
            text: 'Bluetooth selector',
            onTap: () {
              context
                  .bloc<NavdrawerBloc>()
                  .add(NavdrawerUpdated(NavdrawerState.BluetoothSelector));
              ExtendedNavigator.of(context)
                  .replace(Routes.bluetoothSelectorPage);
            },
          ),
          _createDrawerItem(
            icon: Icons.hotel,
            text: 'Record Sleep sequence',
            onTap: () {
              context
                  .bloc<NavdrawerBloc>()
                  .add(NavdrawerUpdated(NavdrawerState.RecordSleep));
              ExtendedNavigator.of(context)
                  .replace(Routes.recordSleepGuidePage);
            },
          ),
          _createDrawerItem(
            icon: Icons.analytics,
            text: 'History',
            onTap: () {
              context
                  .bloc<NavdrawerBloc>()
                  .add(NavdrawerUpdated(NavdrawerState.NightStats));
              ExtendedNavigator.of(context).replace(Routes.sleepHistoryPage);
            },
          ),
          // Todo: link stats page to end of recording and history
          _createDrawerItem(
            icon: Icons.warning,
            text: 'Night Stats',
            onTap: () {
              context
                  .bloc<NavdrawerBloc>()
                  .add(NavdrawerUpdated(NavdrawerState.NightStats));
              ExtendedNavigator.of(context).replace(Routes.nightStatsPage);
            },
          ),
        ],
      ),
    );
  }
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
    {IconData icon, String text, GestureTapCallback onTap}) {
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
    onTap: onTap,
  );
}
