import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/wallets/wallets_cubit.dart';
import 'package:polydodo/src/application/wallets/wallets_state.dart';
import 'package:polydodo/src/domain/wallet/constants.dart';
import 'package:polydodo/src/domain/wallet/money.dart';

import 'wallets_widget.dart';

class WalletsRoute extends StatelessWidget {
  static const name = 'walletsRoute';

  WalletsRoute({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Polydodo')),
      body: BlocConsumer<WalletsCubit, WalletsState>(
        listener: (context, state) {
          if (state is WalletsLoadFailure) {
            Scaffold.of(context).showSnackBar(SnackBar(
              content: Text('Unable to load Wallets because ${state.cause}'),
            ));
          } else if (state is WalletsTransferFailure) {
            Scaffold.of(context).showSnackBar(SnackBar(
              content: Text('Unable to transfer money because ${state.cause}'),
            ));
          }
        },
        builder: (context, state) {
          return Center(
            child: Column(
              children: [
                Text('CAD to USD Rate: $cadToUsdRate'),
                WalletsWidget(state: state),
                if (state is WalletsLoadSuccess)
                  _buildTransferButton(context, state),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildTransferButton(BuildContext context, WalletsLoadSuccess state) {
    final sender = state.wallets[0];
    final receiver = state.wallets[1];
    return RaisedButton(
      child: Text(
        'Send 1 USD from ${sender.owner.firstName} to ${receiver.owner.firstName}',
      ),
      onPressed: () => BlocProvider.of<WalletsCubit>(context).transfer(
        sender,
        receiver,
        Money(1, Currency.usd),
      ),
    );
  }
}
