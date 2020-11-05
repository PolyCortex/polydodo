from classification.validation import validate


class ClassificationRequest():
    def __init__(self, sex, age, stream_start, bedtime, wakeup):
        self.sex = sex
        self.age = age
        self.stream_start = stream_start
        self.bedtime = bedtime
        self.wakeup = wakeup
        self.is_valid = None

    @property
    def in_bed_seconds(self):
        """timespan, in seconds, from which the subject started the recording and went to bed"""
        return self.bedtime - self.stream_start

    @property
    def out_of_bed_seconds(self):
        """timespan, in seconds, from which the subject started the recording and got out of bed"""
        return self.wakeup - self.stream_start

    def validate(self, raw_eeg):
        validate(raw_eeg, self)
