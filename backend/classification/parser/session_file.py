import pandas as pd

from classification.parser.constants import RETAINED_COLUMNS
from classification.parser.csv import read_csv


ROWS_TO_SKIP = 5


def parse_session_file(file):
    """Converts a file following Session File logging format into a np.array
    Input:
    - file: received as an input file
    Returns:
    - np.array of the two EEG channels of interest
    """
    return read_csv(file, ROWS_TO_SKIP, RETAINED_COLUMNS)
