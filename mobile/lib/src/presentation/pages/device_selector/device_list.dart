import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/device/device_selector_cubit.dart';
import 'package:polydodo/src/domain/acquisition_device/device_type.dart';

Widget buildDeviceList(var state) {
  return ListView.builder(
      itemCount: state.devices.length,
      itemBuilder: (context, index) {
        return Card(
          child: ListTile(
            onTap: () => BlocProvider.of<DeviceSelectorCubit>(context)
                .connect(state.devices[index]),
            title: Text(state.devices[index].name),
            subtitle: Text(state.devices[index].id.toString()),
            trailing: _getTrailing(state.devices[index].deviceType),
          ),
        );
      });
}

Widget _getTrailing(DeviceType type) {
  switch (type) {
    case DeviceType.bluetooth:
      return Icon(Icons.bluetooth);
    case DeviceType.serial:
      return Icon(Icons.usb);
    default:
      return Icon(Icons.error);
  }
}
