import pandas as pd
from io import StringIO

from classification.exceptions import ClassificationError


def read_csv(file_content, rows_to_skip=0, columns_to_read=None):
    try:
        raw_array = pd.read_csv(StringIO(file_content),
                                skiprows=rows_to_skip,
                                usecols=columns_to_read
                                ).to_numpy()
    except Exception:
        raise ClassificationError()

    return raw_array
