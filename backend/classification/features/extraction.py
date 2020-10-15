"""Feature extraction tools based off a two channel EEG recording"""
import numpy as np

from classification.config.constants import (
    EEG_CHANNELS,
    AGE_FEATURE_BINS,
)
from classification.features.pipeline import get_feature_union
from classification.features.utils import (
    drop_other_channels,
    crop_raw_data,
    convert_to_epochs,
)


def get_eeg_features(raw_data, in_bed_time, out_of_bed_time):
    """Returns the continuous feature matrix
    Input
    -------
    raw_signal: MNE.Raw object with signals with or without annotations
    in_bed_time: timespan, in seconds, from which the subject started
        the recording and went to bed
    out_of_bed_time: timespan, in seconds, from which the subject
        started the recording and got out of bed

    Returns
    -------
    Array of size (nb_epochs, nb_continuous_features)
    """
    features_file = []

    for channel in EEG_CHANNELS:
        chan_data = drop_other_channels(raw_data.copy(), channel)
        # TODO: input actual bed & out of bed times
        chan_data = crop_raw_data(chan_data, in_bed_time, out_of_bed_time)
        X_file_channel = convert_to_epochs(
            chan_data
        )

        feature_union = get_feature_union()
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
