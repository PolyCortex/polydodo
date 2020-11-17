import 'acquisition_device.dart';

abstract class IAcquisitionDeviceRepository {
  Stream<AcquisitionDevice> scan();

  void connect(AcquisitionDevice device, Function(bool, [Exception]) callback);
  void disconnect();

  Future<Stream<List<int>>> startDataStream();
  void stopDataStream();
}
