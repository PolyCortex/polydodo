"""defines models which predict sleep stages based off EEG signals"""

from classification.features import get_features
from classification.postprocessor import get_hmm_model
from classification.load_model import load_model, load_hmm


class SleepStagesClassifier():
    def __init__(self):
        self.model = load_model()
        self.model_input_name = self.model.get_inputs()[0].name

        self.postprocessor_state = load_hmm()
        self.postprocessor = get_hmm_model(self.postprocessor_state)

    def predict(self, raw_eeg, request):
        """
        Input:
        - raw_eeg: instance of mne.io.RawArray
            Should contain 2 channels (1: FPZ-CZ, 2: PZ-OZ)
        - request: instance of ClassificationRequest
        Returns: array of predicted sleep stages
        """

        features = get_features(raw_eeg, request)

        print(features, features.shape)

        predictions = self._get_predictions(features)
        predictions = self._get_postprocessed_predictions(predictions)

        return predictions

    def _get_predictions(self, features):
        return self.model.run(None, {self.model_input_name: features})[0]

    def _get_postprocessed_predictions(self, predictions):
        return self.postprocessor.predict(predictions.reshape(-1, 1))
