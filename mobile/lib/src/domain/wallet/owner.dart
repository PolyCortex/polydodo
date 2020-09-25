import 'package:meta/meta.dart';

import 'package:polydodo/src/domain/unique_id.dart';

class Owner {
  static const _legalAge = 16;

  final UniqueId id;
  final String firstName;
  final String lastName;
  final int age;

  Owner({
    @required this.id,
    @required this.firstName,
    @required this.lastName,
    @required this.age,
  })  : assert(id != null),
        assert(firstName != null),
        assert(lastName != null) {
    if (firstName.length <= 0 || lastName.length <= 0) {
      throw Exception('First and last name cannot be empty');
    }
    if (!_hasLegalAge()) {
      throw Exception('This owner does not have the legal age');
    }
  }

  bool _hasLegalAge() => age >= _legalAge;

  // In a good model entity, we should have behavorial method...
}
