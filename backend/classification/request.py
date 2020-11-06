
from classification.config.constants import EPOCH_DURATION
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
