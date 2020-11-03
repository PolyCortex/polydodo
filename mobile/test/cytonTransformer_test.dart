import 'package:flutter_test/flutter_test.dart';
import 'package:polydodo/src/infrastructure/eeg_data_transformers/cytonTransformer.dart';

import 'constants.dart';

void main() {
  test('Parse Packet', () {
    final transformer = CytonTransformer.broadcast();

    var result = transformer.parsePacket(cyton_packet);

    expect(result.sublist(1, 5), cyton_expected);
  });

  test('Process Data', () {
    final transformer = CytonTransformer.broadcast();

    var result = transformer.parsePacket(cyton_negative_packet);
    result = transformer.processData(result, true);

    var expected =
        cyton_expected_negative.map((e) => transformer.convertToMicrovolts(e));

    expect(result.sublist(1, 5), expected);
  });
}
