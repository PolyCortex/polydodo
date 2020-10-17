"""
Function utilities to convert data acquired on an OpenBCI
Cyton board using the SD card logging strategy.

TODO: We should look into optimizing this conversion. We currently
convert one line at a time, while a vectorized approach would be much more efficient,
as the conversion of a line does not depend on the other lines.

The file conversion is based off the code written to convert
the raw hexadecimal data to signed decimal values in the OpenBCI GUI:
[https://github.com/OpenBCI/OpenBCI_GUI/blob/f907e6a23e4fe640179ff8421044c641d45f2c12/OpenBCI_GUI/DataLogging.pde#L1554-L1595]
The Cyton board logging format is also described here:
[https://docs.openbci.com/docs/02Cyton/CytonSDCard#data-logging-format]
"""
from io import StringIO
from mne import create_info
from mne.io import RawArray
import numpy as np

from classification.config.constants import (
    EEG_CHANNELS,
    OPENBCI_CYTON_SAMPLE_RATE,
)

ADS1299_Vref = 4.5
ADS1299_gain = 24.
SCALE_uV_PER_COUNT = ADS1299_Vref / ((2**23) - 1) / ADS1299_gain * 1000000

FILE_COLUMN_OFFSET = 1
CYTON_TOTAL_NB_CHANNELS = 8


def get_raw_array(file):
    """Converts a file following the Cyton board SD card logging format into a mne.RawArray
    Input:
    - file: received as an input file
    Returns:
    - mne.RawArray of the two EEG channels of interest
    """
    csv_file_content = StringIO(file.stream.read().decode("UTF8"))

    eeg_raw = []
    for line in csv_file_content.readlines():
        line_splitted = line.split(',')

        if len(line_splitted) >= CYTON_TOTAL_NB_CHANNELS:
            eeg_raw.append(get_decimals_from_hexadecimal_strings(line_splitted))

    eeg_raw = SCALE_uV_PER_COUNT * np.array(eeg_raw, dtype='object')

    raw_object = RawArray(
        np.transpose(eeg_raw),
        info=create_info(
            ch_names=EEG_CHANNELS,
            sfreq=OPENBCI_CYTON_SAMPLE_RATE,
            ch_types='eeg'),
        verbose=False,
    )

    print('First sample values: ', raw_object[:, 0])
    print('Second sample values: ', raw_object[:, 1])
    print('Number of samples: ', raw_object.n_times)
    print('Duration of signal (h): ', raw_object.n_times / (3600 * OPENBCI_CYTON_SAMPLE_RATE))
    print('Channel names: ', raw_object.ch_names)

    return raw_object


def get_decimals_from_hexadecimal_strings(lines):
    """Converts the array of hexadecimal strings to an array of decimal values of the EEG channels
    Input:
    - lines: splitted array of two complement hexadecimal
    Returns:
    - array of decimal values for each EEG channel of interest
    """
    return np.array([
        convert_hexadecimal_to_signed_decimal(hex_value)
        for hex_value in lines[FILE_COLUMN_OFFSET:FILE_COLUMN_OFFSET + len(EEG_CHANNELS)]
    ])


def convert_hexadecimal_to_signed_decimal(hex_value):
    """Converts the hexadecimal value encoded on OpenBCI Cyton SD card to signed decimal
    Input:
    - hex_value: signed hexadecimal value
    Returns:
    - decimal value
    """
    return get_twos_complement(hex_value) if len(hex_value) % 2 == 0 else 0


def get_twos_complement(hexstr):
    """Converts a two complement hexadecimal value in a string to a signed float
    Input:
    - hex_value: signed hexadecimal value
    Returns:
    - decimal value
    """
    bits = len(hexstr) * 4
    value = int(hexstr, 16)
    if value & (1 << (bits - 1)):
        value -= 1 << bits
    return value
