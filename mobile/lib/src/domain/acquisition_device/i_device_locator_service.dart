import 'package:polydodo/src/domain/acquisition_device/acquisition_device.dart';

abstract class IDeviceLocatorService {
  Stream<List<AcquisitionDevice>> scan();

  void connect(AcquisitionDevice device, Function(bool, [Exception]) callback);
  void disconnect();

  Future<Stream<List<int>>> startDataStream();
  void stopDataStream();
}
