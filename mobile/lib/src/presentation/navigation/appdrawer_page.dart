import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/navdrawer/navdrawer_bloc.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

class NavDrawerPage extends StatelessWidget {
  static const name = "appDrawerRoute";

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: <Widget>[
          Expanded(
            child: ListView(
              //padding: const EdgeInsets.only(top: 8.0),
              children: <Widget>[
                ListTile(
                  leading: Icon(Icons.group),
                  title: Text("Record Sleep Page"),
                  onTap: () {
                    context.bloc<NavdrawerBloc>().add(SamplePageEvent());
                    ExtendedNavigator.of(context)
                        .replace(Routes.recordSleepPage);
                  },
                ),
                ListTile(
                  leading: Icon(Icons.group),
                  title: Text("Wallets"),
                  onTap: () {
                    context.bloc<NavdrawerBloc>().add(HomePageEvent());
                    ExtendedNavigator.of(context).replace(Routes.walletsPage);
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
