import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/Bluetooth/bluetooth_cubit.dart';
import 'package:polydodo/src/application/Bluetooth/bluetooth_state.dart';

class BluetoothRoute extends StatelessWidget {
  static const name = 'bluetoothRoute';

  BluetoothRoute({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Polydodo')),
      body: BlocConsumer<BluetoothCubit, BluetoothStates>(
        listener: (context, state) {
          print(state.runtimeType);
          if (state is BluetoothSearchError) {
            Scaffold.of(context).showSnackBar(SnackBar(
              content: Text(
                  'Unable to search for bluetooth devices Wallets because ${state.cause}'),
            ));
          } else if (state is BluetoothConnectionFailure) {
            Scaffold.of(context).showSnackBar(SnackBar(
              content:
                  Text('Unable to connect to device because ${state.cause}'),
            ));
          }
        },
        builder: (context, state) {
          if (state is BluetoothSearching)
            return ListView.builder(
                itemCount: state.devices.length,
                itemBuilder: (context, index) {
                  return Card(
                    child: ListTile(
                        onTap: () => BlocProvider.of<BluetoothCubit>(context)
                            .connect(
                                state.devices[index]),
                        title: Text(
                            state.devices[index].name),
                        subtitle: Text(state
                            .devices[index]
                            .id
                            .toString())),
                  );
                });
          else
            return new ListView();
        },
      ),
    );
  }
}
