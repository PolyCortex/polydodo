import 'package:polydodo/src/domain/wallet/wallet.dart';

abstract class WalletsState {}

class WalletsInitial extends WalletsState {}

class WalletsLoadInProgress extends WalletsState {}

class WalletsLoadSuccess extends WalletsState {
  final List<Wallet> wallets;

  WalletsLoadSuccess(this.wallets);
}

class WalletsLoadFailure extends WalletsState {
  final Exception cause;

  WalletsLoadFailure(this.cause);
}

class WalletsTransferFailure extends WalletsState {
  final Exception cause;

  WalletsTransferFailure(this.cause);
}
