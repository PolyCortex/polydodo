"""defines models which predict sleep stages based off EEG signals"""

from classification.features import get_features
from classification.validation import validate
from classification.postprocessor import get_hmm_model
from classification.load_model import load_model, load_hmm
from classification.metric.epochs import get_labelled_epochs


class SleepStagesClassifier():
    def __init__(self):
        self.model = load_model()
        self.model_input_name = self.model.get_inputs()[0].name

        self.postprocessor_state = load_hmm()
        self.postprocessor = get_hmm_model(self.postprocessor_state)

    def predict(self, raw_eeg, info):
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
        Returns: array of predicted sleep stages
        """

        validate(raw_eeg, info)
        features = get_features(raw_eeg, info)

        print(features, features.shape)

        predictions = self._get_predictions(features)
        predictions = self._get_postprocessed_predictions(predictions)

        print(predictions)

        labelled_epochs = get_labelled_epochs(predictions, info['in_bed_seconds'])

        print(labelled_epochs)

        return labelled_epochs

    def _get_predictions(self, features):
        return self.model.run(None, {self.model_input_name: features})[0]

    def _get_postprocessed_predictions(self, predictions):
        return self.postprocessor.predict(predictions.reshape(-1, 1))
