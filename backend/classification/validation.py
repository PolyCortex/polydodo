from classification.config.constants import (
    FILE_MINIMUM_DURATION,
    ACCEPTED_AGE_RANGE,
)
from classification.exceptions import (
    TimestampsError,
    FileSizeError,
    ClassificationError,
)


def validate(raw_eeg, request):
    _validate_timestamps(request.in_bed_seconds, request.out_of_bed_seconds)
    _validate_file_with_timestamps(raw_eeg, request.out_of_bed_seconds)
    _validate_age(request.age)


def _validate_timestamps(in_bed_seconds, out_of_bed_seconds):
    has_positive_timespan = in_bed_seconds > 0 and out_of_bed_seconds > 0
    has_got_out_of_bed_after_in_bed = out_of_bed_seconds > in_bed_seconds
    has_respected_minimum_bed_time = (out_of_bed_seconds - in_bed_seconds) > FILE_MINIMUM_DURATION

    if not(
        has_positive_timespan
        and has_got_out_of_bed_after_in_bed
        and has_respected_minimum_bed_time
    ):
        raise TimestampsError()


def _validate_file_with_timestamps(raw_eeg, out_of_bed_seconds):
    has_raw_respected_minimum_file_size = raw_eeg.times[-1] > FILE_MINIMUM_DURATION

    if not has_raw_respected_minimum_file_size:
        raise FileSizeError()

    is_raw_at_least_as_long_as_out_of_bed = raw_eeg.times[-1] >= out_of_bed_seconds

    if not is_raw_at_least_as_long_as_out_of_bed:
        raise TimestampsError()


def _validate_age(age):
    is_in_accepted_range = ACCEPTED_AGE_RANGE[0] <= int(age) <= ACCEPTED_AGE_RANGE[1]

    if not(is_in_accepted_range):
        raise ClassificationError('invalid age')
