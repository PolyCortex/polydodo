import pandas as pd

from classification.exceptions import ClassificationError
from classification.parser.constants import RETAINED_COLUMNS

ROWS_TO_SKIP = 5


def parse_session_file(file):
    """Converts a file following Session File logging format into a np.array
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

    return eeg_raw
