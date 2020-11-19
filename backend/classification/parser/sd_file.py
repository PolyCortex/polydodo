import numpy as np

from classification.parser.constants import RETAINED_COLUMNS
from classification.parser.csv import read_csv
from classification.parser.constants import SCALE_V_PER_COUNT

ROWS_TO_SKIP = 2

SIGNED_BIT = int("800000", 16)
SIGNED_BIT_2 = 2 * SIGNED_BIT


def _hexstr_to_int(hexstr):
    """Converts a two complement hexadecimal value in a string to a signed float
    Input:
    - hex_value: signed hexadecimal value
    Returns:
    - decimal value
    """
    raw_int = int(hexstr, 16)
    return raw_int - SIGNED_BIT_2 if raw_int >= SIGNED_BIT else raw_int


def parse_sd_file(file):
    """Converts a file following SD File logging format into a np.array
    Input:
    - file: received as an input file
    Returns:
    - np.array of the two EEG channels of interest
    """
    eeg_raw = read_csv(file, ROWS_TO_SKIP, RETAINED_COLUMNS)
    hexstr_to_int = np.vectorize(_hexstr_to_int)
    eeg_raw = hexstr_to_int(eeg_raw)
    eeg_raw = np.transpose(eeg_raw) * SCALE_V_PER_COUNT
    return eeg_raw
