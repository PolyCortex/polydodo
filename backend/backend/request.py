import logging

from classification.config.constants import EPOCH_DURATION
from classification.config.constants import (
    FILE_MINIMUM_DURATION,
    ACCEPTED_AGE_RANGE,
)
from classification.exceptions import (
    TimestampsError,
    FileSizeError,
    ClassificationError,
)

_logger = logging.getLogger(__name__)


class ClassificationRequest():
    def __init__(self, sex, age, stream_start, bedtime, wakeup, raw_eeg, stream_duration=None):
        self.sex = sex
        self.age = age
        self.stream_start = stream_start
        self.bedtime = bedtime
        self.wakeup = wakeup
        self.raw_eeg = raw_eeg
        print("hey")
        self.stream_duration = stream_duration if stream_duration else self._get_stream_duration()

        self._validate()

    def _get_stream_duration(self):
        PERIOD_DURATION = 1 / self.raw_eeg.info['sfreq']
        return self.raw_eeg.times[-1] + PERIOD_DURATION

    @property
    def in_bed_seconds(self):
        """timespan, in seconds, from which the subject started the recording and went to bed"""
        return self.bedtime - self.stream_start

    @property
    def out_of_bed_seconds(self):
        """timespan, in seconds, from which the subject started the recording and got out of bed"""
        print(self.wakeup)
        print(self.stream_start)
        return self.wakeup - self.stream_start

    @property
    def n_epochs(self):
        return (self.wakeup - self.bedtime) / EPOCH_DURATION

    def _validate(self):
        print('validating')
        self._validate_timestamps()
        self._validate_file_with_timestamps()
        self._validate_age()

    def _validate_timestamps(self):
        has_positive_timespan = self.bedtime > self.stream_start and self.wakeup > self.stream_start
        has_got_out_of_bed_after_in_bed = self.wakeup > self.bedtime
        has_respected_minimum_bed_time = (self.wakeup - self.bedtime) > FILE_MINIMUM_DURATION

        if not(
            has_positive_timespan
            and has_got_out_of_bed_after_in_bed
            and has_respected_minimum_bed_time
        ):
            _logger.warn("Received timestamps are invalid.")
            raise TimestampsError()

    def _validate_file_with_timestamps(self):
        has_raw_respected_minimum_file_size = self.raw_eeg.times[-1] > FILE_MINIMUM_DURATION

        if not has_raw_respected_minimum_file_size:
            print("HERE 1")
            _logger.warn(f"Uploaded file must at least have {FILE_MINIMUM_DURATION} seconds of data.")
            raise FileSizeError()
        print(self.raw_eeg.times)
        print(self.out_of_bed_seconds)
        is_raw_at_least_as_long_as_out_of_bed = self.raw_eeg.times[-1] >= self.out_of_bed_seconds

        if not is_raw_at_least_as_long_as_out_of_bed:
            print("HERE 2")
            _logger.warn(
                "Uploaded file must at least last the time between the start of the "
                f"stream and out of bed time, which is {self.out_of_bed_seconds} seconds.")
            raise TimestampsError()

    def _validate_age(self):
        is_in_accepted_range = ACCEPTED_AGE_RANGE[0] <= int(self.age) <= ACCEPTED_AGE_RANGE[1]

        if not(is_in_accepted_range):
            print("HERE 3")
            _logger.warn(f"Age must be in the following range: {ACCEPTED_AGE_RANGE}")
            raise ClassificationError('invalid age')
