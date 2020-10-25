const START_STREAM_CHAR = 'b';
const STOP_STREAM_CHAR = 's';

const GANGLION_NUMBER_CHANNELS = 4;
const GANGLION_PACKET_SIZE = 20;
const GANGLION_NUMBER_COLUMNS = 15;
const GANGLION_EXTRA_COLUMNS = 10;
const OPEN_BCI_GANGLION_HEADER = [
  ["%OpenBCI Raw EEG Data"],
  ["%Number of channels = 4"],
  ["%Sample Rate = 200 Hz"],
  ["%Board = OpenBCI_GUI\$BoardGanglionBLE"],
  [
    "Sample Index",
    " EXG Channel 0",
    " EXG Channel 1",
    " EXG Channel 2",
    " EXG Channel 3",
    " Accel Channel 0",
    " Accel Channel 1",
    " Accel Channel 2",
    " Other",
    " Other",
    " Other",
    " Other",
    " Other",
    " Timestamp",
    " Timestamp (Formatted)"
  ]
];

const CYTON_MESSAGE_FOOTER = "\$\$\$";
const CYTON_GET_STATUS = [0xF0, 0x07];
const CYTON_SYSTEM_UP = "Success: System is Up\$\$\$";
const CYTON_NUMBER_CHANNELS = 8;
const CYTON_PACKET_SIZE = 33;
const CYTON_NUMBER_COLUMNS = 24;
const CYTON_EXTRA_COLUMNS = 15;
const CYTON_HEADER = 160;
const CYTON_FOOTER_MINIMUM = 192;
const OPEN_BCI_CYTON_HEADER = [
  ["%OpenBCI Raw EEG Data"],
  ["%Number of channels = 8"],
  ["%Sample Rate = 250 Hz"],
  ["%Board = OpenBCI_GUI\$BoardCytonSerial"],
  [
    "Sample Index",
    " EXG Channel 0",
    " EXG Channel 1",
    " EXG Channel 2",
    " EXG Channel 3",
    " EXG Channel 4",
    " EXG Channel 5",
    " EXG Channel 6",
    " EXG Channel 7",
    " Accel Channel 0",
    " Accel Channel 1",
    " Accel Channel 2",
    " Other",
    " Other",
    " Other",
    " Other",
    " Other",
    " Other",
    " Other",
    " Analog Channel 0",
    " Analog Channel 1",
    " Analog Channel 2",
    " Timestamp",
    " Timestamp (Formatted)"
  ]
];
