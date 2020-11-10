import pandas as pd

from classification.exceptions import ClassificationError

def read_csv(file, rows_to_skip=0, columns_to_read=None):
    try:
        raw_array = pd.read_csv(file,
                              skiprows=rows_to_skip,
                              usecols=columns_to_read
                              ).to_numpy()
    except Exception:
        raise ClassificationError()

    return raw_array
