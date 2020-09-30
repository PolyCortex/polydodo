import 'package:flutter_blue/flutter_blue.dart';

abstract class BluetoothStates {}

class BluetoothInitial extends BluetoothStates {}

class BluetoothSearching extends BluetoothStates {
  final List<BluetoothDevice> devices;

  BluetoothSearching(this.devices);
}

class BluetoothSearchError extends BluetoothStates {
  final Exception cause;

  BluetoothSearchError(this.cause);
}

class BluetoothConnecting extends BluetoothStates {}

class BluetoothConnectionSuccess extends BluetoothStates {}

class BluetoothConnectionFailure extends BluetoothStates {
  final Exception cause;

  BluetoothConnectionFailure(this.cause);
}
