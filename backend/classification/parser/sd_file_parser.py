import pandas as pd
import numpy as np

from classification.exceptions import ClassificationError
from classification.parser.constants import RETAINED_COLUMNS

ROWS_TO_SKIP = 2


def _hexstr_to_int(hexstr):
    """Converts a two complement hexadecimal value in a string to a signed float
    Input:
    - hex_value: signed hexadecimal value
    Returns:
    - decimal value
    """
    return int.from_bytes(bytes.fromhex(hexstr), byteorder='big', signed=True)


def parse_sd_file(file):
    """Converts a file following SD File logging format into a np.array
    Input:
    - file: received as an input file
    Returns:
    - np.array of the two EEG channels of interest
    """
    try:
        eeg_raw = pd.read_csv(file,
                              skiprows=ROWS_TO_SKIP,
                              usecols=RETAINED_COLUMNS
                              ).to_numpy()
    except Exception:
        raise ClassificationError()

    hexstr_to_int = np.vectorize(_hexstr_to_int)
    eeg_raw = hexstr_to_int(eeg_raw)

    return eeg_raw
