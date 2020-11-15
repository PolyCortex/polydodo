import 'package:auto_route/auto_route.dart';
import 'package:auto_route/auto_route_annotations.dart';
import 'package:polydodo/src/presentation/pages/dashboard/dashboard_page.dart';
import 'package:polydodo/src/presentation/pages/device_selector/device_selector_page.dart';
import 'package:polydodo/src/presentation/pages/record_sleep/record_sleep_guide_page.dart';
import 'package:polydodo/src/presentation/pages/record_sleep/record_sleep_recording_page.dart';
import 'package:polydodo/src/presentation/pages/record_sleep/record_sleep_validate_page.dart';
import 'package:polydodo/src/presentation/pages/sleep_history_page/sleep_history_page.dart';
import 'package:polydodo/src/presentation/pages/sleep_sequence_stats_page/sleep_sequence_stats_page.dart';

@MaterialAutoRouter(
    generateNavigationHelperExtension: true,
    routes: <AutoRoute>[
      CustomRoute(
          page: DashboardPage,
          initial: true,
          transitionsBuilder: TransitionsBuilders.fadeIn),
      CustomRoute(
          page: RecordSleepGuidePage,
          transitionsBuilder: TransitionsBuilders.fadeIn),
      CustomRoute(
          page: RecordSleepValidatePage,
          transitionsBuilder: TransitionsBuilders.fadeIn),
      CustomRoute(
          page: RecordSleepRecordingPage,
          transitionsBuilder: TransitionsBuilders.fadeIn),
      CustomRoute(
          page: DeviceSelectorPage,
          transitionsBuilder: TransitionsBuilders.fadeIn),
      CustomRoute(
          page: SleepHistoryPage,
          transitionsBuilder: TransitionsBuilders.fadeIn),
      CustomRoute(
          page: SleepSequenceStatsPage,
          transitionsBuilder: TransitionsBuilders.fadeIn),
    ])
class $Router {}
