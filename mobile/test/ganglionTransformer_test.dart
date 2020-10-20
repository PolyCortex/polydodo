import 'package:flutter_test/flutter_test.dart';
import 'package:polydodo/src/infrastructure/eeg_data_transformers/ganglionTransformer.dart';
import 'constants.dart';

void main() {
  final transformer = GanglionTransformer.broadcast();
  test('Parse 19 bit packet', () {
    var result = transformer.parse19Bit(ganglion_compressed_packet);

    expect(result.sublist(1, 5), ganglion_expected_compressed_1);
    expect(result.sublist(16, 20), ganglion_expected_compressed_2);
  });

  test('Parse 19 bit packet - Negative', () {
    var expected_1 = ganglion_expected_negative_1
        .map((e) => transformer.convertToMicrovolts(e));

    var expected_2 = ganglion_expected_negative_2
        .map((e) => transformer.convertToMicrovolts(e));

    var result = transformer.parse19Bit(ganglion_negative_packet);

    result = transformer.processData(result,
        nbSamples: 2, hasNegativeCompression: true, isDelta: false);

    expect(result.sublist(1, 5), expected_1);
    expect(result.sublist(16, 20), expected_2);
  });

  test('Parse raw', () {
    var result = transformer.parseRaw(raw_packet);
    expect(result.sublist(1, 5), expected_raw);
  });
}
