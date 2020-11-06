import numpy as np

from classification.config.constants import EPOCH_DURATION, SleepStage


class ClassificationResponse():
    def __init__(self, request, predictions):
        self.sex = request.sex
        self.age = request.age
        self.stream_start = request.stream_start
        self.stream_duration = request.stream_duration
        self.bedtime = request.bedtime
        self.wakeup = request.wakeup
        self.n_epochs = request.n_epochs

        self.predictions = predictions

    @property
    def sleep_stages(self):
        ordered_sleep_stage_names = np.array([SleepStage(stage_index).name for stage_index in range(len(SleepStage))])
        return ordered_sleep_stage_names[self.predictions]

    @property
    def epochs(self):
        timestamps = np.arange(self.n_epochs * EPOCH_DURATION, step=EPOCH_DURATION) + self.bedtime
        return {'timestamps': timestamps.tolist(), 'stages': self.sleep_stages.tolist()}

    @property
    def metadata(self):
        return {
            "sessionStartTime": self.stream_start,
            "sessionEndTime": self.stream_duration + self.stream_start,
            "totalSessionTime": self.stream_duration,
            "bedTime": self.bedtime,
            "wakeUpTime": None,
            "totalBedTime": None,
        }

    @property
    def subject(self):
        return {
            'age': self.age,
            'sex': self.sex.name,
        }

    def get_response(self):
        return {
            'epochs': self.epochs,
            'report': None,
            'metadata': self.metadata,
            'subject': self.subject,
            'board': None,
            'spectrograms': None,
        }
