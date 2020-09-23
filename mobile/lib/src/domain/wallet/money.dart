import 'package:equatable/equatable.dart';

enum Currency { usd, cad }

// Value object usually extends equatable
class Money extends Equatable {
  static const _min = 0;
  static const _usdToCadRate = 1.32;

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
      return value / _usdToCadRate;
    }
    return value;
  }

  double get cad {
    if (currency == Currency.usd) {
      return value * _usdToCadRate;
    }
    return value;
  }

  Money operator +(Money other) => Money(this.usd + other.usd, Currency.usd);
  Money operator -(Money other) => Money(this.usd - other.usd, Currency.usd);

  @override
  List<Object> get props => [usd];
}
