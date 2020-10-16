// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// AutoRouteGenerator
// **************************************************************************

// ignore_for_file: public_member_api_docs

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';

import '../../record_sleep/record_sleep_page.dart';
import '../../wallets/wallets_page.dart';
import '../appdrawer_page.dart';

class Routes {
  static const String appDrawerPage = '/app-drawer-page';
  static const String walletsPage = '/';
  static const String recordSleepPage = '/record-sleep-page';
  static const all = <String>{
    appDrawerPage,
    walletsPage,
    recordSleepPage,
  };
}

class Router extends RouterBase {
  @override
  List<RouteDef> get routes => _routes;
  final _routes = <RouteDef>[
    RouteDef(Routes.appDrawerPage, page: AppDrawerPage),
    RouteDef(Routes.walletsPage, page: WalletsPage),
    RouteDef(Routes.recordSleepPage, page: RecordSleepPage),
  ];
  @override
  Map<Type, AutoRouteFactory> get pagesMap => _pagesMap;
  final _pagesMap = <Type, AutoRouteFactory>{
    AppDrawerPage: (data) {
      return MaterialPageRoute<dynamic>(
        builder: (context) => AppDrawerPage(),
        settings: data,
      );
    },
    WalletsPage: (data) {
      final args = data.getArgs<WalletsPageArguments>(
        orElse: () => WalletsPageArguments(),
      );
      return MaterialPageRoute<dynamic>(
        builder: (context) => WalletsPage(key: args.key),
        settings: data,
      );
    },
    RecordSleepPage: (data) {
      return MaterialPageRoute<dynamic>(
        builder: (context) => RecordSleepPage(),
        settings: data,
      );
    },
  };
}

/// ************************************************************************
/// Navigation helper methods extension
/// *************************************************************************

extension RouterExtendedNavigatorStateX on ExtendedNavigatorState {
  Future<dynamic> pushAppDrawerPage() => push<dynamic>(Routes.appDrawerPage);

  Future<dynamic> pushWalletsPage({
    Key key,
  }) =>
      push<dynamic>(
        Routes.walletsPage,
        arguments: WalletsPageArguments(key: key),
      );

  Future<dynamic> pushRecordSleepPage() =>
      push<dynamic>(Routes.recordSleepPage);
}

/// ************************************************************************
/// Arguments holder classes
/// *************************************************************************

/// WalletsPage arguments holder class
class WalletsPageArguments {
  final Key key;
  WalletsPageArguments({this.key});
}
