import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';

abstract class DeviceState {}

class DeviceInitial extends DeviceState {}

class DeviceSearchInProgress extends DeviceState {
  final List<AcquisitionDevice> devices;

  DeviceSearchInProgress(this.devices);
}

class DeviceSearchFailure extends DeviceState {
  final Exception cause;

  DeviceSearchFailure(this.cause);
}

class DeviceConnectionInProgress extends DeviceState {}

class DeviceConnectionSuccess extends DeviceState {}

class DeviceConnectionFailure extends DeviceState {
  final Exception cause;

  DeviceConnectionFailure(this.cause);
}
