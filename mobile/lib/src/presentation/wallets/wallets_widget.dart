import 'package:flutter/material.dart';
import 'package:polydodo/src/application/wallets/wallets_state.dart';

import 'wallet_widget.dart';

class WalletsWidget extends StatelessWidget {
  final WalletsState state;

  const WalletsWidget({Key key, @required this.state}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (state is WalletsLoadSuccess) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: (state as WalletsLoadSuccess)
            .wallets
            .map((wallet) => Container(
                  child: WalletWidget(wallet: wallet),
                  margin: EdgeInsets.all(24),
                ))
            .toList(),
      );
    }

    return SizedBox(
      child: CircularProgressIndicator(),
      height: 50,
      width: 50,
    );
  }
}
