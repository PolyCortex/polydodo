import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_blue/flutter_blue.dart';
import 'package:polydodo/src/domain/bluetooth/i_bluetooth_repository.dart';
import 'bluetooth_selector_state.dart';

class BluetoothSelectorCubit extends Cubit<BluetoothStates> {
  final IBluetoothRepository _bluetoothRepository;

  BluetoothSelectorCubit(this._bluetoothRepository)
      : super(BluetoothInitial()) {
    startSearching();
  }

  void startSearching() {
    _bluetoothRepository.initializeBluetooth();
    _bluetoothRepository
        .watch()
        .listen((devices) => emit(BluetoothSearchInProgress(devices)))
        .onError((e) => emit(BluetoothSearchFailure(e)));
  }

  void connect(BluetoothDevice bluetoothDevice) async {
    emit(BluetoothConnectionInProgress());

    _bluetoothRepository
        .connect(bluetoothDevice)
        .then((value) => emit(BluetoothConnectionSuccess()))
        .catchError((e) => {emit(BluetoothConnectionFailure(e))});
  }
}
