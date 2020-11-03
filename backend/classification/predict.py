"""defines functions to predict sleep stages based off EEG signals"""
from classification.features import get_features
from classification.validation import validate


def predict(raw_eeg, info):
    """
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
    """
    validate(raw_eeg, info)
    X_openbci = get_features(raw_eeg, info)

    print(X_openbci[0], X_openbci.shape)
