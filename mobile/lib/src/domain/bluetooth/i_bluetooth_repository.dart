import 'bluetooth.dart';

abstract class IBluetoothRepository {
  void initializeBluetooth();
  
  Future<void> connect(Bluetooth bluetoothDevice);
  void disconnect();

  Future<Stream<List<int>>> startDataStream();
  void stopDataStream();

  Stream<List<Bluetooth>> watch();
}
