"""
Function utilities to convert data acquired on an OpenBCI
Cyton board using the SD card logging strategy.

TODO: Consider cropping file (from bed to wake up time) here, before the for loop. Have to consider
not all lines hold sample values (i.e. first line with comment and second line with a single timestamp).

The file conversion is based off the code written to convert
the raw hexadecimal data to signed decimal values in the OpenBCI GUI:
[https://github.com/OpenBCI/OpenBCI_GUI/blob/f907e6a23e4fe640179ff8421044c641d45f2c12/OpenBCI_GUI/DataLogging.pde#L1554-L1595]
The Cyton board logging format is also described here:
[https://docs.openbci.com/docs/02Cyton/CytonSDCard#data-logging-format]
"""
from mne import create_info
from mne.io import RawArray
import numpy as np
import pandas as pd

from classification.config.constants import (
    EEG_CHANNELS,
    OPENBCI_CYTON_SAMPLE_RATE,
)

ADS1299_Vref = 4.5
ADS1299_gain = 24.
SCALE_uV_PER_COUNT = ADS1299_Vref / ((2**23) - 1) / ADS1299_gain * 1000000
SCALE_V_PER_COUNT = SCALE_uV_PER_COUNT / 1e6

FILE_COLUMN_OFFSET = 1
CYTON_TOTAL_NB_CHANNELS = 8
SKIP_ROWS = 2


def get_raw_array(file):
    """Converts a file following the Cyton board SD card logging format into a mne.RawArray
    Input:
    - file: received as an input file
    Returns:
    - mne.RawArray of the two EEG channels of interest
    """

    retained_columns = tuple(range(1, len(EEG_CHANNELS) + 1))
    eeg_raw = pd.read_csv(file,
                          skiprows=SKIP_ROWS,
                          usecols=retained_columns
                          ).to_numpy()

    hexstr_to_int = np.vectorize(_hexstr_to_int)
    eeg_raw = hexstr_to_int(eeg_raw)

    raw_object = RawArray(
        SCALE_V_PER_COUNT * np.transpose(eeg_raw),
        info=create_info(
            ch_names=EEG_CHANNELS,
            sfreq=OPENBCI_CYTON_SAMPLE_RATE,
            ch_types='eeg'),
        verbose=False,
    )
    print(f"""
        First sample values: {raw_object[:, 0]}
        Second sample values: {raw_object[:, 1]}
        Number of samples: {raw_object.n_times}
        Duration of signal (h): {raw_object.n_times / (3600 * OPENBCI_CYTON_SAMPLE_RATE)}
        Channel names: {raw_object.ch_names}
    """)

    return raw_object


def _hexstr_to_int(hexstr):
    """Converts a two complement hexadecimal value in a string to a signed float
    Input:
    - hex_value: signed hexadecimal value
    Returns:
    - decimal value
    """
    return int.from_bytes(bytes.fromhex(hexstr), byteorder='big', signed=True)
