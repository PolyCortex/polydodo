"""defines functions to predict sleep stages based off EEG signals"""
from classification.features import get_features
from classification.validation import validate


def predict(raw_eeg, age, sex, stream_start, bedtime, wakeup):
    """
    Input:
    - raw_eeg: instance of mne.io.RawArray
        Should contain 2 channels (1: FPZ-CZ, 2: PZ-OZ)
    - sex: should either be 'F' or 'M'
    - age: indicates the subject's age
    - start_stream: UNIX timestamp of time at which recording started
    - bedtime: UNIX timestamp of time at which to start classification (W before)
    - wakeup: UNIX timestamp of time at which to end classification (W after)

    """
    age, stream_start, bedtime, wakeup = int(age), int(stream_start), int(bedtime), int(wakeup)

    in_bed_seconds = bedtime - stream_start
    out_of_bed_seconds = wakeup - stream_start

    validate(raw_eeg, age, sex, in_bed_seconds, out_of_bed_seconds)

    X_openbci = get_features(
        raw_eeg, age, sex, in_bed_seconds, out_of_bed_seconds
    )

    # print(X_openbci, X_openbci.shape)
