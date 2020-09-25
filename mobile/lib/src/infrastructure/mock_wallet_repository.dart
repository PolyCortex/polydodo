import 'dart:async';

import 'package:polydodo/src/domain/wallet/i_wallet_repository.dart';
import 'package:polydodo/src/domain/wallet/wallet.dart';

class MockWalletRepository implements IWalletRepository {
  static List<Wallet> walletsMockPersistency = [];
  final streamController = StreamController<List<Wallet>>();

  @override
  Future<void> store(Wallet wallet) async {
    await Future.delayed(Duration(milliseconds: 400));
    final idx = walletsMockPersistency.indexOf(wallet);
    idx == -1
        ? walletsMockPersistency.add(wallet)
        : walletsMockPersistency[idx] = wallet;
    streamController.add(walletsMockPersistency);
  }

  @override
  Stream<List<Wallet>> watch() => streamController.stream;
}
