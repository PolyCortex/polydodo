"""Feature extraction tools based off a two channel EEG recording"""
import numpy as np

from backend.config.constants import (
    EEG_CHANNELS,
    AGE_FEATURE_BINS,
)
from backend.features.utils import (
    drop_other_channels,
    crop_raw_data,
    convert_to_epochs,
)


def get_eeg_features(raw_data):
    features_file = []

    for channel in EEG_CHANNELS:
        chan_data = drop_other_channels(raw_data.copy(), channel)
        # TODO: input actual bed & out of bed times
        chan_data = crop_raw_data(chan_data, 0, 100)
        X_file_channel = convert_to_epochs(
            chan_data
        )

        X_features = feature_union.transform(X_file_channel)
        features_file.append(X_features)

        print(
            f"Done extracting {X_features.shape[1]} features "
            f"on {X_features.shape[0]} epochs for {channel}\n"
        )

    return np.hstack(tuple(features_file))


def get_categorical_features(age, sex, nb_epochs):
    """Returns the categorical feature matrix
    Input
    -------
    age: Age of the subject
    sex: Sex of the subject
    nb_epochs: corresponds to the nb of epochs which will be analyzed.

    Returns
    -------
    Array of size (nb_epochs,nb_categorical_features), which contains
    (duplicated) value for all epochs because it concerns the same subject.
    """
    age_category = next(
        category_index
        for category_index, age_range in enumerate(AGE_FEATURE_BINS)
        if age >= age_range[0] and age <= age_range[1]
    )

    X_categorical = [sex, age_category]

    return np.array(
        X_categorical * nb_epochs
    ).reshape(nb_epochs, len(X_categorical))
