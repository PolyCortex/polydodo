import 'acquisition_device.dart';

abstract class IAcquisitionDeviceRepository {
  void initializeBluetooth();

  Future<void> connect(AcquisitionDevice device);
  void disconnect();

  Future<Stream<List<int>>> startDataStream();
  void stopDataStream();

  Stream<List<AcquisitionDevice>> watch();
}
