RegExp IP_ADDRESS_REGEX = RegExp(
  r'^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$',
);

const DEFAULT_AGE = 30;
const DEFAULT_SERVER_ADDRESS = '192.168.1.1';

const MIN_AGE = 12;
const MAX_AGE = 125;
final MIN_BIRTH_DATE = DateTime.now().subtract(Duration(days: 365 * MAX_AGE));
final MAX_BIRTH_DATE = DateTime.now().subtract(Duration(days: 365 * MIN_AGE));
