import 'dart:math';

import 'package:bloc/bloc.dart';

import 'package:polydodo/src/application/wallets/wallets_state.dart';
import 'package:polydodo/src/domain/unique_id.dart';
import 'package:polydodo/src/domain/wallet/i_wallet_repository.dart';
import 'package:polydodo/src/domain/wallet/money.dart';
import 'package:polydodo/src/domain/wallet/owner.dart';
import 'package:polydodo/src/domain/wallet/wallet.dart';

class WalletsCubit extends Cubit<WalletsState> {
  final IWalletRepository _walletRepository;

  WalletsCubit(this._walletRepository) : super(WalletsInitial()) {
    createNewWallets();
    emit(WalletsLoadInProgress());
    _walletRepository
        .watch()
        .listen((wallets) => emit(WalletsLoadSuccess(wallets)))
        .onError((e) => emit(WalletsLoadFailure(e)));
  }

  // Does not yield another state
  void transfer(Wallet sender, Wallet receiver, Money amount) async {
    try {
      sender.transfer(amount, receiver);
    } catch (e) {
      emit(WalletsTransferFailure(e));
    }
    await Future.wait([
      _walletRepository.store(sender),
      _walletRepository.store(receiver),
    ]).catchError((e) => emit(WalletsTransferFailure(e)));
  }

  Future<List<void>> createNewWallets() => Future.wait([
        _walletRepository.store(
          Wallet(
            UniqueId(),
            Owner(
              id: UniqueId.from('1'),
              firstName: 'Bob',
              lastName: 'Skiridovsky',
              age: 25,
            ),
            Money(Random().nextDouble() * 10, Currency.cad),
          ),
        ),
        _walletRepository.store(
          Wallet(
            UniqueId(),
            Owner(
              id: UniqueId.from('2'),
              firstName: 'Alice',
              lastName: 'Pogo',
              age: 35,
            ),
            Money(Random().nextDouble() * 1000, Currency.cad),
          ),
        )
      ]);
}
