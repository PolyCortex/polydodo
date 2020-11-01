import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/device/device_selector_cubit.dart';
import 'package:polydodo/src/application/device/device_selector_state.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';

import 'record_sleep/record_sleep_guide_page.dart';

class BluetoothSelectorPage extends StatelessWidget {
  static const name = 'bluetoothRoute';

  BluetoothSelectorPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Polydodo')),
      drawer: NavDrawerPage(),
      body: BlocConsumer<DeviceSelectorCubit, DeviceState>(
        listener: (context, state) {
          print(state.runtimeType);
          if (state is DeviceSearchFailure) {
            Scaffold.of(context).showSnackBar(SnackBar(
              content: Text(
                  'Unable to search for bluetooth devices because ${state.cause}'),
            ));
          } else if (state is DeviceConnectionFailure) {
            Scaffold.of(context).showSnackBar(SnackBar(
              content:
                  Text('Unable to connect to device because ${state.cause}'),
            ));
          } else if (state is DeviceConnectionSuccess) {
            Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => RecordSleepGuidePage(),
                ));
          }
        },
        builder: (context, state) {
          if (state is DeviceSearchInProgress) {
            return ListView.builder(
                itemCount: state.devices.length,
                itemBuilder: (context, index) {
                  return Card(
                    child: ListTile(
                        onTap: () =>
                            BlocProvider.of<DeviceSelectorCubit>(context)
                                .connect(state.devices[index]),
                        title: Text(state.devices[index].name),
                        subtitle: Text(state.devices[index].id.toString())),
                  );
                });
          } else {
            return Container();
          }
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: BlocProvider.of<DeviceSelectorCubit>(context).swapBluetooth,
      ),
    );
  }
}
