import 'package:polydodo/src/domain/bluetooth/bluetooth.dart';

abstract class BluetoothStates {}

class BluetoothInitial extends BluetoothStates {}

class BluetoothSearching extends BluetoothInitial {
  final List<Bluetooth> devices;

  BluetoothSearching(this.devices);
}

class BluetoothSearchError extends BluetoothStates {
  final Exception cause;

  BluetoothSearchError(this.cause);
}

class BluetoothConnecting extends BluetoothStates {}

class BluetoothConnectionSucess extends BluetoothStates {}

class BluetoothConnectionFailure extends BluetoothStates {
  final Exception cause;

  BluetoothConnectionFailure(this.cause);
}
