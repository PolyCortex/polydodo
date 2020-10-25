"""Feature extraction tools based off a two channel EEG recording"""
import numpy as np

from classification.config.constants import (
    EEG_CHANNELS,
    AGE_FEATURE_BINS,
)
from classification.features.pipeline import get_feature_union
from classification.features.preprocessing import preprocess


def get_eeg_features(raw_data, in_bed_seconds, out_of_bed_seconds):
    """Returns the continuous feature matrix
    Input
    -------
    raw_signal: MNE.Raw object with signals with or without annotations
    in_bed_seconds: timespan, in seconds, from which the subject started
        the recording and went to bed
    out_of_bed_seconds: timespan, in seconds, from which the subject
        started the recording and got out of bed

    Returns
    -------
    Array of size (nb_epochs, nb_continuous_features)
    """
    features_file = []
    feature_union = get_feature_union()

    for channel in EEG_CHANNELS:
        chan_data = preprocess(raw_data, channel, in_bed_seconds, out_of_bed_seconds)

        X_features = feature_union.transform(chan_data)
        features_file.append(X_features)

        print(
            f"Done extracting {X_features.shape[1]} features "
            f"on {X_features.shape[0]} epochs for {channel}\n"
        )

    return np.hstack(tuple(features_file))


def get_non_eeg_features(age, sex, nb_epochs):
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
    X_categorical = [sex.value, age_category]

    return np.array(X_categorical * nb_epochs).reshape(nb_epochs, -1)
