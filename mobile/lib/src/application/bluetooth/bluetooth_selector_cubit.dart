import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_blue/flutter_blue.dart';
import 'package:polydodo/src/domain/domain.dart';
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
        .listen((devices) => emit(BluetoothSearching(devices)))
        .onError((e) => emit(BluetoothSearchError(e)));
  }

  void connect(BluetoothDevice bluetoothDevice) async {
    emit(BluetoothConnecting());

    _bluetoothRepository
        .connect(bluetoothDevice)
        .then((value) => emit(BluetoothConnectionSuccess()))
        .catchError((e) => {emit(BluetoothConnectionFailure(e))});
  }
}
