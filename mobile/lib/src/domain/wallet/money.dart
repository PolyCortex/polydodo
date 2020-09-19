import 'package:equatable/equatable.dart';

import 'constants.dart';

enum Currency { usd, cad }

Map<Currency, String> currencyToString = {
  Currency.usd: 'USD',
  Currency.cad: 'CAD',
};

// Value object usually extends equatable
class Money extends Equatable {
  static const _min = 0;

  final double value;
  final Currency currency;

  Money(this.value, this.currency)
      : assert(value != null),
        assert(currency != null) {
    // Validation that money cannot be in an impossible state
    if (value <= _min) {
      Exception('Money amount cannot be inferior to $_min');
    }
  }

  double get usd {
    if (currency == Currency.cad) {
      return value / cadToUsdRate;
    }
    return value;
  }

  double get cad {
    if (currency == Currency.usd) {
      return value * cadToUsdRate;
    }
    return value;
  }

  Money convertTo(Currency currency) {
    if (currency == Currency.usd) {
      return Money(usd, currency);
    }
    return Money(cad, currency);
  }

  /// Gives back result into left operand's currency
  Money operator +(Money other) =>
      Money(this.usd + other.usd, Currency.usd).convertTo(this.currency);
  Money operator -(Money other) =>
      Money(this.usd - other.usd, Currency.usd).convertTo(this.currency);

  @override
  List<Object> get props => [usd];
}
