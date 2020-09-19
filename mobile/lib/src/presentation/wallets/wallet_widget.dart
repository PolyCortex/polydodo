import 'package:flutter/material.dart';
import 'package:polydodo/src/domain/wallet/money.dart';
import 'package:polydodo/src/domain/wallet/wallet.dart';

class WalletWidget extends StatelessWidget {
  final Wallet wallet;

  const WalletWidget({Key key, @required this.wallet}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final currency = currencyToString[wallet.money.currency];
    return Container(
      child: Column(
        children: [
          Text('${wallet.owner.firstName} ${wallet.owner.lastName}'),
          Text('ID: ${wallet.owner.id.get()}'),
          Text('${wallet.money.value.toStringAsFixed(2)} $currency'),
        ],
      ),
    );
  }
}
