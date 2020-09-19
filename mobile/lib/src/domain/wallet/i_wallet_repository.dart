import 'wallet.dart';

abstract class IWalletRepository {
  Future<void> store(Wallet wallet);
  Stream<List<Wallet>> watch();
}
