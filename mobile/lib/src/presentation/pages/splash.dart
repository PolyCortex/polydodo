import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';
import 'package:polydodo/src/presentation/widgets/loading_indicator.dart';

class SplashPage extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _SplashPageLoadingState();
}

class _SplashPageLoadingState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    Timer(Duration(seconds: 2),
        () => ExtendedNavigator.of(context).popAndPush(Routes.dashboardPage));
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: LoadingIndicator(),
    );
  }
}
