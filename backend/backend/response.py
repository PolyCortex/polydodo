import numpy as np

from backend.metric import Metrics
from classification.config.constants import EPOCH_DURATION, SleepStage


class ClassificationResponse():
    def __init__(self, request, predictions, spectrogram):
        self.sex = request.sex
        self.age = request.age
        self.stream_start = request.stream_start
        self.stream_duration = request.stream_duration
        self.bedtime = request.bedtime
        self.wakeup = request.wakeup
        self.n_epochs = request.n_epochs

        self.spectrogram = spectrogram
        self.predictions = predictions
        self.metrics = Metrics(self.sleep_stages, self.bedtime)

    @property
    def sleep_stages(self):
        ordered_sleep_stage_names = np.array(SleepStage.tolist())
        return ordered_sleep_stage_names[self.predictions]

    @property
    def response(self):
        return {
            'epochs': self._epochs,
            'report': self._report,
            'metadata': self._metadata,
            'subject': self._subject,
            'spectrograms': self.spectrogram,
        }

    @property
    def _epochs(self):
        timestamps = np.arange(self.n_epochs * EPOCH_DURATION, step=EPOCH_DURATION) + self.bedtime
        return {'timestamps': timestamps.tolist(), 'stages': self.sleep_stages.tolist()}

    @property
    def _metadata(self):
        return {
            "sessionStartTime": self.stream_start,
            "sessionEndTime": self.stream_duration + self.stream_start,
            "totalSessionTime": self.stream_duration,
            "bedTime": self.bedtime,
            "wakeUpTime": self.wakeup,
            "totalBedTime": self.wakeup - self.bedtime,
        }

    @property
    def _subject(self):
        return {
            'age': self.age,
            'sex': self.sex.name,
        }

    @property
    def _report(self):
        return self.metrics.report
