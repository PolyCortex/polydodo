import 'package:polydodo/src/domain/unique_id.dart';

import 'money.dart';
import 'owner.dart';

// We call Wallet an aggregate root because it own other entities
class Wallet {
  final UniqueId id;
  final Owner owner;
  Money money;

  Wallet(this.id, this.owner, this.money);

  // Wallet is an entity and therefore it must have a behavior. It is here that
  // business logic appears.
  void transfer(Money amount, Wallet receiver) {
    if (money.usd - amount.usd < 0) {
      throw Exception(
        'Not enough money in this wallet to perform this transaction',
      );
    }
    money -= amount;
    receiver._receive(amount);
  }

  void _receive(Money amount) {
    money += amount;
  }

  @override
  bool operator ==(other) => this.id == other.id;

  @override
  int get hashCode => super.hashCode;
}
