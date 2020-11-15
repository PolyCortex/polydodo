import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/device/device_selector_cubit.dart';
import 'package:polydodo/src/application/device/device_selector_state.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_tabs.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';

import 'device_list.dart';

class DeviceSelectorPage extends StatelessWidget {
  static const name = 'DeviceSelectorRoute';

  DeviceSelectorPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Polydodo')),
      drawer: NavDrawer(activeTab: NavdrawerTab.DeviceSelector),
      body: BlocConsumer<DeviceSelectorCubit, DeviceState>(
        listener: (context, state) {
          print(state.runtimeType);
          if (state is DeviceSearchFailure) {
            Scaffold.of(context).showSnackBar(SnackBar(
              content:
                  Text('Unable to search for devices because ${state.cause}'),
            ));
          } else if (state is DeviceConnectionFailure) {
            Scaffold.of(context).showSnackBar(SnackBar(
              content:
                  Text('Unable to connect to device because ${state.cause}'),
            ));
          } else if (state is DeviceConnectionSuccess) {
            ExtendedNavigator.of(context).replace(Routes.recordSleepGuidePage);
          }
        },
        builder: (context, state) {
          if (state is DeviceSearchInProgress) {
            return buildDeviceList(state);
          } else {
            return Container();
          }
        },
      ),
    );
  }
}
