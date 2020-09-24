import 'package:bloc/bloc.dart';
import 'package:polydodo/src/domain/bluetooth/bluetooth.dart';
import 'package:polydodo/src/domain/bluetooth/i_bluetooth_repository.dart';
import 'package:flutter_blue/flutter_blue.dart';
import 'bluetooth_state.dart';

class BluetoothCubit extends Cubit<BluetoothStates> {
  final IBluetoothRepository _bluetoothRepository;

  BluetoothCubit(this._bluetoothRepository) : super(BluetoothInitial()) {
    startSearching();
  }

  void startSearching() {
    FlutterBlue flutterBlue = FlutterBlue.instance;
    flutterBlue.connectedDevices
        .asStream()
        .listen((List<BluetoothDevice> devices) {
      for (BluetoothDevice device in devices) {
        _bluetoothRepository.addDevice(device);
      }
    });
    flutterBlue.scanResults.listen((List<ScanResult> results) {
      for (ScanResult result in results) {
        _bluetoothRepository.addDevice(result.device);
      }
    });
    flutterBlue.startScan();
    _bluetoothRepository
        .watch()
        .listen((devices) => emit(BluetoothSearching(devices)))
        .onError((e) => emit(BluetoothSearchError(e)));
  }

  void connect(Bluetooth bluetoothDevice) async {
    try {
      emit(BluetoothConnecting());
      await bluetoothDevice.device.connect().then((value) => findRelevantCharacteristics(bluetoothDevice));
    } catch (e) {
      if (e.code != 'already_connected') {
        emit(BluetoothConnectionFailure(e));
      }
    }
  }

  void findRelevantCharacteristics(Bluetooth bluetoothDevice) {
    emit(BluetoothConnectionSucess());

    bluetoothDevice.device.discoverServices().then((services) => {
          for (BluetoothService service in services)
            {
              if (service.toString().contains(Bluetooth.BLE_SERVICE))
                {
                  for (BluetoothCharacteristic characteristic
                      in service.characteristics)
                    {
                      if (characteristic
                          .toString()
                          .contains(Bluetooth.BLE_RECEIVE))
                        bluetoothDevice.setReceiveCharacteristic(characteristic)
                      else if (characteristic
                          .toString()
                          .contains(Bluetooth.BLE_SEND))
                        bluetoothDevice.setReceiveCharacteristic(characteristic)
                    }
                }
            }
        });
  }
}
