import 'package:auto_route/auto_route_annotations.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/pages/bluetooth_page/bluetoothSelector_page.dart';
import 'package:polydodo/src/presentation/pages/dashboard/dashboard_page.dart';
import 'package:polydodo/src/presentation/pages/night_stats_page/night_stats_page.dart';
import 'package:polydodo/src/presentation/pages/record_sleep/record_sleep_guide_page.dart';

@MaterialAutoRouter(
    generateNavigationHelperExtension: true,
    routes: <AutoRoute>[
      MaterialRoute(page: NavDrawerPage),
      MaterialRoute(page: DashBoardPage, initial: true),
      MaterialRoute(page: RecordSleepGuidePage),
      MaterialRoute(page: RecordSleepValidatePage),
      MaterialRoute(page: BluetoothSelectorPage),
      MaterialRoute(page: NightStatsPage),
    ])
class $Router {}
