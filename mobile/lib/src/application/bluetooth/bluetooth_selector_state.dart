import 'package:flutter_blue/flutter_blue.dart';

abstract class BluetoothStates {}

class BluetoothInitial extends BluetoothStates {}

class BluetoothSearchInProgress extends BluetoothStates {
  final List<BluetoothDevice> devices;

  BluetoothSearchInProgress(this.devices);
}

class BluetoothSearchFailure extends BluetoothStates {
  final Exception cause;

  BluetoothSearchFailure(this.cause);
}

class BluetoothConnectionInProgress extends BluetoothStates {}

class BluetoothConnectionSuccess extends BluetoothStates {}

class BluetoothConnectionFailure extends BluetoothStates {
  final Exception cause;

  BluetoothConnectionFailure(this.cause);
}
