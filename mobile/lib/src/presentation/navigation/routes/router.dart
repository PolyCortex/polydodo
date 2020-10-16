import 'package:auto_route/auto_route_annotations.dart';
import 'package:polydodo/src/presentation/navigation/appdrawer_page.dart';
import 'package:polydodo/src/presentation/record_sleep/record_sleep_page.dart';
import 'package:polydodo/src/presentation/wallets/wallets_page.dart';

@MaterialAutoRouter(
    generateNavigationHelperExtension: true,
    routes: <AutoRoute>[
      MaterialRoute(page: NavDrawerPage),
      MaterialRoute(page: WalletsPage, initial: true),
      MaterialRoute(page: RecordSleepPage),
    ])
class $Router {}
