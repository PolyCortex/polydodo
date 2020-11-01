"""defines functions to predict sleep stages based off EEG signals"""
from classification.features import get_features
from classification.validation import validate
from classification.postprocess import postprocess


def predict(raw_eeg, model, info):
    """
    Input:
    - raw_eeg: instance of mne.io.RawArray
        Should contain 2 channels (1: FPZ-CZ, 2: PZ-OZ)
    - model: dict
        Contains an instance of InferenceSession and the matrices
        needed for the postprocessing
    - info: dict
        Should contain the following keys:
        - sex: instance of Sex enum
        - age: indicates the subject's age
        - in_bed_seconds: timespan, in seconds, from which
            the subject started the recording and went to bed
        - out_of_bed_seconds: timespan, in seconds, from which
            the subject started the recording and got out of bed
    """
    classifier, postprocessing_state = model['classifier'], model['postprocessing']

    validate(raw_eeg, info)
    features = get_features(raw_eeg, info)
    input_name = classifier.get_inputs()[0].name

    predictions = classifier.run(None, {input_name: features})[0]
    predictions = postprocess(predictions, postprocessing_state)

    print(features[0], features.shape)
    print(predictions)
