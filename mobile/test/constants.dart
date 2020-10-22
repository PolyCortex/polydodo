// Ganglion

const ganglion_compressed_packet = [
  101,
  0,
  0,
  0,
  0,
  8,
  0,
  5,
  0,
  0,
  72,
  0,
  9,
  240,
  1,
  176,
  0,
  48,
  0,
  8
];

const ganglion_expected_compressed_1 = [0, 2, 10, 4];
const ganglion_expected_compressed_2 = [262148, 507910, 393222, 8];

const ganglion_negative_packet = [
  101,
  255,
  255,
  191,
  255,
  239,
  255,
  252,
  255,
  255,
  88,
  0,
  11,
  62,
  56,
  224,
  0,
  63,
  240,
  1
];

const ganglion_expected_negative_1 = [-3, -5, -7, -11];
const ganglion_expected_negative_2 = [-262139, -198429, -262137, -4095];

const raw_packet = [
  0,
  4,
  0,
  4,
  7,
  192,
  6,
  6,
  0,
  6,
  0,
  0,
  8,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
];

const expected_raw = [262148, 507910, 393222, 8];

// Cyton

const cyton_packet = [
  160,
  243,
  250,
  250,
  2,
  250,
  248,
  164,
  251,
  6,
  30,
  250,
  211,
  205,
  156,
  60,
  249,
  156,
  190,
  128,
  154,
  202,
  100,
  176,
  224,
  132,
  0,
  0,
  0,
  0,
  0,
  0,
  192
];

const cyton_expected = [16448002, 16447652, 16451102, 16438221];

const cyton_negative_packet = [
  160,
  243,
  0x7F,
  0xFF,
  0xFF,
  0xFF,
  0xFF,
  0xFF,
  0x80,
  0x00,
  0x01,
  0x5D,
  0xCB,
  0xED,
  0xA2,
  0x34,
  0x13,
  156,
  190,
  128,
  154,
  202,
  100,
  176,
  0,
  0,
  0,
  0,
  0,
  0,
  192
];

const cyton_expected_negative = [8388607, -1, -8388607, 6147053];
