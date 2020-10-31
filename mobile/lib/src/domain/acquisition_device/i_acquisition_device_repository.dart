import 'acquisition_device.dart';

abstract class IAcquisitionDeviceRepository {
  void initializeRepository();

  void connect(AcquisitionDevice device, Function(bool, [Exception]) callback);
  void disconnect();

  Future<Stream<List<int>>> startDataStream();
  void stopDataStream();

  Stream<List<AcquisitionDevice>> watch();
}
