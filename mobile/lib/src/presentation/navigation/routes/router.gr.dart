// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// AutoRouteGenerator
// **************************************************************************

// ignore_for_file: public_member_api_docs

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';

import '../../pages/bluetooth_page/bluetoothSelector_page.dart';
import '../../pages/dashboard/dashboard_page.dart';
import '../../pages/night_stats_page/night_stats_page.dart';
import '../../pages/record_sleep/record_sleep_guide_page.dart';
import '../../pages/sleep_history_page/sleep_history_page.dart';
import '../navdrawer_widget.dart';

class Routes {
  static const String navDrawerPage = '/nav-drawer-page';
  static const String dashBoardPage = '/';
  static const String recordSleepGuidePage = '/record-sleep-guide-page';
  static const String recordSleepValidatePage = '/record-sleep-validate-page';
  static const String bluetoothSelectorPage = '/bluetooth-selector-page';
  static const String sleepHistoryPage = '/sleep-history-page';
  static const String nightStatsPage = '/night-stats-page';
  static const all = <String>{
    navDrawerPage,
    dashBoardPage,
    recordSleepGuidePage,
    recordSleepValidatePage,
    bluetoothSelectorPage,
    sleepHistoryPage,
    nightStatsPage,
  };
}

class Router extends RouterBase {
  @override
  List<RouteDef> get routes => _routes;
  final _routes = <RouteDef>[
    RouteDef(Routes.navDrawerPage, page: NavDrawerPage),
    RouteDef(Routes.dashBoardPage, page: DashBoardPage),
    RouteDef(Routes.recordSleepGuidePage, page: RecordSleepGuidePage),
    RouteDef(Routes.recordSleepValidatePage, page: RecordSleepValidatePage),
    RouteDef(Routes.bluetoothSelectorPage, page: BluetoothSelectorPage),
    RouteDef(Routes.sleepHistoryPage, page: SleepHistoryPage),
    RouteDef(Routes.nightStatsPage, page: NightStatsPage),
  ];
  @override
  Map<Type, AutoRouteFactory> get pagesMap => _pagesMap;
  final _pagesMap = <Type, AutoRouteFactory>{
    NavDrawerPage: (data) {
      return MaterialPageRoute<dynamic>(
        builder: (context) => NavDrawerPage(),
        settings: data,
      );
    },
    DashBoardPage: (data) {
      return MaterialPageRoute<dynamic>(
        builder: (context) => DashBoardPage(),
        settings: data,
      );
    },
    RecordSleepGuidePage: (data) {
      return MaterialPageRoute<dynamic>(
        builder: (context) => RecordSleepGuidePage(),
        settings: data,
      );
    },
    RecordSleepValidatePage: (data) {
      return MaterialPageRoute<dynamic>(
        builder: (context) => RecordSleepValidatePage(),
        settings: data,
      );
    },
    BluetoothSelectorPage: (data) {
      final args = data.getArgs<BluetoothSelectorPageArguments>(
        orElse: () => BluetoothSelectorPageArguments(),
      );
      return MaterialPageRoute<dynamic>(
        builder: (context) => BluetoothSelectorPage(key: args.key),
        settings: data,
      );
    },
    SleepHistoryPage: (data) {
      return MaterialPageRoute<dynamic>(
        builder: (context) => SleepHistoryPage(),
        settings: data,
      );
    },
    NightStatsPage: (data) {
      return MaterialPageRoute<dynamic>(
        builder: (context) => NightStatsPage(),
        settings: data,
      );
    },
  };
}

/// ************************************************************************
/// Navigation helper methods extension
/// *************************************************************************

extension RouterExtendedNavigatorStateX on ExtendedNavigatorState {
  Future<dynamic> pushNavDrawerPage() => push<dynamic>(Routes.navDrawerPage);

  Future<dynamic> pushDashBoardPage() => push<dynamic>(Routes.dashBoardPage);

  Future<dynamic> pushRecordSleepGuidePage() =>
      push<dynamic>(Routes.recordSleepGuidePage);

  Future<dynamic> pushRecordSleepValidatePage() =>
      push<dynamic>(Routes.recordSleepValidatePage);

  Future<dynamic> pushBluetoothSelectorPage({
    Key key,
  }) =>
      push<dynamic>(
        Routes.bluetoothSelectorPage,
        arguments: BluetoothSelectorPageArguments(key: key),
      );

  Future<dynamic> pushSleepHistoryPage() =>
      push<dynamic>(Routes.sleepHistoryPage);

  Future<dynamic> pushNightStatsPage() => push<dynamic>(Routes.nightStatsPage);
}

/// ************************************************************************
/// Arguments holder classes
/// *************************************************************************

/// BluetoothSelectorPage arguments holder class
class BluetoothSelectorPageArguments {
  final Key key;
  BluetoothSelectorPageArguments({this.key});
}
