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

class Routes {
  static const String dashboardPage = '/';
  static const String recordSleepGuidePage = '/record-sleep-guide-page';
  static const String recordSleepValidatePage = '/record-sleep-validate-page';
  static const String bluetoothSelectorPage = '/bluetooth-selector-page';
  static const String sleepHistoryPage = '/sleep-history-page';
  static const String nightStatsPage = '/night-stats-page';
  static const all = <String>{
    dashboardPage,
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
    RouteDef(Routes.dashboardPage, page: DashboardPage),
    RouteDef(Routes.recordSleepGuidePage, page: RecordSleepGuidePage),
    RouteDef(Routes.recordSleepValidatePage, page: RecordSleepValidatePage),
    RouteDef(Routes.bluetoothSelectorPage, page: BluetoothSelectorPage),
    RouteDef(Routes.sleepHistoryPage, page: SleepHistoryPage),
    RouteDef(Routes.nightStatsPage, page: NightStatsPage),
  ];
  @override
  Map<Type, AutoRouteFactory> get pagesMap => _pagesMap;
  final _pagesMap = <Type, AutoRouteFactory>{
    DashboardPage: (data) {
      return PageRouteBuilder<dynamic>(
        pageBuilder: (context, animation, secondaryAnimation) =>
            DashboardPage(),
        settings: data,
        transitionsBuilder: TransitionsBuilders.fadeIn,
      );
    },
    RecordSleepGuidePage: (data) {
      return PageRouteBuilder<dynamic>(
        pageBuilder: (context, animation, secondaryAnimation) =>
            RecordSleepGuidePage(),
        settings: data,
        transitionsBuilder: TransitionsBuilders.fadeIn,
      );
    },
    RecordSleepValidatePage: (data) {
      return PageRouteBuilder<dynamic>(
        pageBuilder: (context, animation, secondaryAnimation) =>
            RecordSleepValidatePage(),
        settings: data,
        transitionsBuilder: TransitionsBuilders.fadeIn,
      );
    },
    BluetoothSelectorPage: (data) {
      final args = data.getArgs<BluetoothSelectorPageArguments>(
        orElse: () => BluetoothSelectorPageArguments(),
      );
      return PageRouteBuilder<dynamic>(
        pageBuilder: (context, animation, secondaryAnimation) =>
            BluetoothSelectorPage(key: args.key),
        settings: data,
        transitionsBuilder: TransitionsBuilders.fadeIn,
      );
    },
    SleepHistoryPage: (data) {
      return PageRouteBuilder<dynamic>(
        pageBuilder: (context, animation, secondaryAnimation) =>
            SleepHistoryPage(),
        settings: data,
        transitionsBuilder: TransitionsBuilders.fadeIn,
      );
    },
    NightStatsPage: (data) {
      return PageRouteBuilder<dynamic>(
        pageBuilder: (context, animation, secondaryAnimation) =>
            NightStatsPage(),
        settings: data,
        transitionsBuilder: TransitionsBuilders.fadeIn,
      );
    },
  };
}

/// ************************************************************************
/// Navigation helper methods extension
/// *************************************************************************

extension RouterExtendedNavigatorStateX on ExtendedNavigatorState {
  Future<dynamic> pushDashboardPage() => push<dynamic>(Routes.dashboardPage);

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
