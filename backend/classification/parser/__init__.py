"""
Function utilities to convert data acquired on an OpenBCI board

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

from classification.config.constants import OPENBCI_CYTON_SAMPLE_RATE, EEG_CHANNELS
from classification.parser.constants import SCALE_V_PER_COUNT
from classification.parser.file_type import detect_file_type


def get_raw_array(file):
    """Converts a file following a logging format into a mne.RawArray
    Input:
    - file: received as an input file
    Returns:
    - mne.RawArray of the two EEG channels of interest
    """

    filetype = detect_file_type(file)
    print(f"""
    Detected {filetype.name} format.
    """)

    parse = filetype.parser
    eeg_raw = parse(file)

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
