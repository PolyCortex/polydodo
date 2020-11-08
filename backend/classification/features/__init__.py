import numpy as np

from classification.features.extraction import (
    get_eeg_features,
    get_non_eeg_features,
)


def get_features(signal, request):
    """Returns the raw features
    Input:
    - raw_eeg: instance of mne.io.RawArray
        Should contain 2 channels (1: FPZ-CZ, 2: PZ-OZ)
    - info: instance of ClassificationRequest
    Returns
    -------
    - features X in a vector of (nb_epochs, nb_features)
    """
    X_eeg = get_eeg_features(signal, request.in_bed_seconds, request.out_of_bed_seconds)
    X_categorical = get_non_eeg_features(request.age, request.sex, X_eeg.shape[0])

    return np.append(X_categorical, X_eeg, axis=1).astype(np.float32)
