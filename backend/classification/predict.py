"""defines functions to predict sleep stages based off EEG signals"""
from classification.features import get_features
from classification.validation import validate


def predict(raw_eeg, model, info):
    """
    Input:
    - raw_eeg: instance of mne.io.RawArray
        Should contain 2 channels (1: FPZ-CZ, 2: PZ-OZ)
    - model: instance of InferenceSession
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
    features = get_features(raw_eeg, info)

    input_name = model.get_inputs()[0].name
    predictions = model.run(None, {input_name: features})[0]

    print(features[0], features.shape)
    print(predictions)
