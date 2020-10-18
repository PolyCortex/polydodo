import numpy as np

from classification.features.extraction import (
    get_eeg_features,
    get_categorical_features,
)


def get_features(signal, age, sex, in_bed_seconds, out_of_bed_seconds):
    """Returns the raw features
    Input
    -------
    - raw_signal: MNE.Raw object with signals with or without annotations
    - age: Age of the subject
    - sex: Sex of the subject
    - in_bed_seconds: timespan, in seconds, from which the subject started
        the recording and went to bed
    - out_of_bed_seconds: timespan, in seconds, from which the subject
        started the recording and got out of bed

    Returns
    -------
    - features X in a vector of (nb_epochs, nb_features)
    """
    X_eeg = get_eeg_features(signal, in_bed_seconds, out_of_bed_seconds)
    X_categorical = get_categorical_features(age, sex, X_eeg.shape[0])

    return np.append(X_categorical, X_eeg, axis=1)
