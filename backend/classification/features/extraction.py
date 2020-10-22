"""Feature extraction tools based off a two channel EEG recording"""
import numpy as np

from classification.config.constants import (
    EEG_CHANNELS,
    AGE_FEATURE_BINS,
    DATASET_SAMPLE_RATE,
)
from classification.features.constants import DATASET_HIGH_PASS_FREQ
from classification.features.pipeline import get_feature_union
from classification.features.preprocessing import (
    drop_other_channels,
    crop_raw_data,
    convert_to_epochs,
)


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

    for channel in EEG_CHANNELS:
        chan_data = drop_other_channels(raw_data.copy(), channel)
        chan_data = crop_raw_data(chan_data, in_bed_seconds, out_of_bed_seconds)
        chan_data = chan_data.resample(DATASET_SAMPLE_RATE)
        chan_data = chan_data.filter(l_freq=DATASET_HIGH_PASS_FREQ, h_freq=None)

        X_file_channel = convert_to_epochs(chan_data, in_bed_seconds)

        feature_union = get_feature_union()
        print('Started feature ext on epochs: ', X_file_channel)

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
    X_categorical = [sex.value, age_category]

    return np.array(X_categorical * nb_epochs).reshape(nb_epochs, -1)
