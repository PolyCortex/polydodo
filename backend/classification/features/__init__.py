import numpy as np

from classification.features.extraction import (
    get_eeg_features,
    get_categorical_features,
)


def get_features(signal, info):
    """Returns the raw features
    Input:
    - raw_eeg: instance of mne.io.RawArray
        Should contain 2 channels (1: FPZ-CZ, 2: PZ-OZ)
    - info: dict
        Should contain the following keys:
        - sex: instance of Sex enum
        - age: indicates the subject's age
        - in_bed_seconds: timespan, in seconds, from which
            the subject started the recording and went to bed
        - out_of_bed_seconds: timespan, in seconds, from which
            the subject started the recording and got out of bed
    Returns
    -------
    - features X in a vector of (nb_epochs, nb_features)
    """
    X_eeg = get_eeg_features(signal, info['in_bed_seconds'], info['out_of_bed_seconds'])
    X_categorical = get_categorical_features(info['age'], info['sex'], X_eeg.shape[0])

    return np.append(X_categorical, X_eeg, axis=1)
