import numpy as np

from classification.config.constants import EPOCH_DURATION, SleepStage
from classification.validation import validate


class ClassificationRequest():
    def __init__(self, sex, age, stream_start, bedtime, wakeup, raw_eeg):
        self.sex = sex
        self.age = age
        self.stream_start = stream_start
        self.bedtime = bedtime
        self.wakeup = wakeup

        self.stream_duration = raw_eeg.times[-1]
        self.raw_eeg = raw_eeg
        self.is_valid = None

    @property
    def in_bed_seconds(self):
        """timespan, in seconds, from which the subject started the recording and went to bed"""
        return self.bedtime - self.stream_start

    @property
    def out_of_bed_seconds(self):
        """timespan, in seconds, from which the subject started the recording and got out of bed"""
        return self.wakeup - self.stream_start

    @property
    def n_epochs(self):
        return (self.wakeup - self.bedtime) / EPOCH_DURATION

    def validate(self):
        validate(self.raw_eeg, self)


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
