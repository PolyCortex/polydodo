import numpy as np

from backend.features.extraction import (
    get_eeg_features,
    get_categorical_features,
)


def get_features(signal, age, sex):
    """Returns the raw features
    Input
    -------
    raw_signal: MNE.Raw object with signals with or without annotations
    age: Age of the subject
    sex: Sex of the subject

    Returns
    -------
    - features X in a vector of (nb_epochs, nb_features)
    """
    X_eeg = get_eeg_features(signal)
    X_categorical = get_categorical_features(age, sex, X_eeg.shape[0])

    return np.append(X_categorical, X_eeg, axis=1)
