import 'package:polydodo/src/domain/unique_id.dart';

import 'wallet.dart';

abstract class IWalletRepository {
  Future<void> write(Wallet wallet);
  Stream<Wallet> watch(UniqueId walletId);
}
