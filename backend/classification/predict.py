"""defines functions to predict sleep stages based off EEG signals"""
from classification.features import get_features


def predict(raw_eeg, age, sex):
    """
    raw_eeg: instance of mne.io.RawArray
        Should contain 2 channels (1: FPZ-CZ, 2: PZ-OZ)
    sex: should either be 'F' or 'M'
    age: indicates the subject's age
    """
    X_openbci, y_openbci = get_features(raw_eeg, age, sex)
